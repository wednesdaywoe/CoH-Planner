---
project: coh-sidekick
kind: plan
title: Build Share-Preview Image
id-prefix: EMBED
area: shared-builds
created: 2026-09-03
satisfied: 2026-09-03
relates:
  - OPEN_ITEMS.md
---

# Build Share-Preview Image

Source of truth for making a shared build unfurl in Discord/Slack/etc. with a
per-build social-preview image, instead of the one static site-wide `og:image`
every URL currently shows. Requested so builds shared as a link stay legible
without opening the app — matching the value people currently get by hand
(screenshotting the build to fake an embed).

**Thesis:** a public or unlisted build shared as `coh-sidekick.com/builds/:id`
unfurls with a per-build preview image showing archetype/primary/secondary/level,
headline stats (max HP, regen, end gain/drain, S/L and defense/resistance bands),
and a compact taken-vs-skipped power icon row — while a private build's link
still unfurls with only the generic site-wide card, leaking nothing per-build.

**satisfied-when:** EMBED1..EMBED6 all `[x]`

**Live verification gap, found and closed 2026-09-03:** first real-world test
(user's own build, `TIZbOh3wV5`) got the per-build title/description but the
generic site-wide image — Discord screenshot below. Root cause: the frontend
half (EMBED2/EMBED3) only ever existed as local commits; the Supabase edge
functions and the Cloudflare Worker deploy independently of git and were
already live, but `main` was 8 commits behind `origin/main` (this repo
deploys the frontend via GitHub Actions on push, per `ARCHITECTURE.md`), so
the deployed site had no `SharePreviewCapture` and never sent
`preview_image_base64` at all — title/description still updated because
`shareBuild()` already sent those fields before this feature existed.
Pushed (user-approved), confirmed the GitHub Pages deploy succeeded, and
re-verified end-to-end directly against `coh-sidekick.com` (not just
`localhost`) — a fresh share now gets a real `preview_image_path` and the
Worker serves the correct `og:image`. The user's original `TIZbOh3wV5` link
will pick up an image the next time they re-share/update it.

## Preconditions

Checked now (cheap, code/DNS-derived):
- `coh-sidekick.com` resolves through Cloudflare (NS = `*.ns.cloudflare.com`,
  `A` records are Cloudflare anycast ranges) — confirmed via `dig`. This is what
  makes EMBED4 possible at all.
- Hosting is a static SPA on GitHub Pages with no per-path server-side templating
  ([ARCHITECTURE.md](../ARCHITECTURE.md)) — confirmed. A crawler hitting
  `/builds/:id` gets the same `index.html` as every other route, so per-build
  `<meta>` tags cannot come from the origin; they have to be injected in front of
  it. This is why EMBED4 is a Cloudflare Worker, not a GitHub Pages change.
- No Supabase Storage bucket is currently provisioned anywhere in this project
  (grepped `src/` + `supabase/`, no hits) — new infra, scoped in EMBED1.
- Power icons are same-origin static assets (`public/img/powers/*.png`), so a
  `<canvas>` renderer compositing them will not taint the canvas — confirmed via
  `public/img/powers/`. This is what makes client-side `canvas.toBlob()` viable
  for EMBED2.
- The browser already computes full build stats (via the `coh_wasm` engine built
  by `scripts/build-engine.mjs`) before/at share time — confirmed. This is the
  fact the whole render-approach decision below leans on.

**Not yet checked — confirm before EMBED4 starts:** Cloudflare account access
sufficient to add a Worker and a route on `coh-sidekick.com` (dashboard or API
token). Nothing in this repo indicates existing Worker infra to extend.

## Decision — render approach (2026-09-03, user-chosen)

Client-side snapshot at share time: render the PNG in the browser (where stats
and the WASM engine already ran) and upload it to Supabase Storage, keyed by
build id. `og:image` becomes a stable, cacheable Storage URL.

Rejected: server-side render-on-demand (a Supabase Edge Function recomputes
stats and renders fresh on every crawler hit). Always fresh and needs no
Storage bucket, but requires either proving the Rust→WASM engine (built for
`--target web` and `--target nodejs`, not Deno) runs under a Supabase Edge
Function, or duplicating stat math server-side — a second place the numbers
could diverge, which this project treats as a serious defect everywhere else.

## Decision — image content (2026-09-03, user-chosen)

Headline stats + compact power row: archetype/sets/level, a handful of
headline numbers (max HP, regen, end gain/drain, def/res bands), and a compact
icon row for powers taken (skipped powers shown faded/empty, not omitted, so
"what did they skip" is still legible). No per-power slotting/enhancement
detail — not legible at social-embed image sizes.

*(The faded-skipped-powers half of that was reversed in round three below: it
turned out not to be legible at embed size either.)*

**Two-round legibility correction, found live 2026-09-03 (after this doc
closed):** the first pass (commit `614261b342`, `CURRENT_PREVIEW_TEMPLATE_VERSION`
1) sized type against a full-resolution screenshot downscaled to a *guessed*
Discord embed width and looked fine — but the user's own Discord screenshots
of the deployed result said otherwise twice: once genuinely too small, and
once (`CURRENT_PREVIEW_TEMPLATE_VERSION` 2) still not legible enough even
after a real size bump, because bigger type within the same content density
(8 stat tiles + 3 icon rows + a footer hint) left a real overflow bug — the
Pool/Epic icon row clipped against the footer border, measured live via
`getBoundingClientRect`/`scrollHeight` rather than guessed. Fixed by both
bumping type further *and* cutting the footer's "faded icon = skipped power"
hint line (least essential content) to reclaim room, then re-verified the
same way — measured heights match content heights (no clipping) and a
400px/320px downscale (bracketing the range a real Discord client renders
at) both read cleanly. Lesson for next time: verify against an *actual*
posted Discord embed's measured pixel width, not an assumed one — a
downscaled screenshot that "looks fine" zoomed in is not the same claim as
"legible at the size a viewer will actually see."

**Third round, 2026-09-03 (`CURRENT_PREVIEW_TEMPLATE_VERSION` 3):** rounds one
and two both tried to make the *same* content bigger, and both ran out of card.
Round three cut content instead. Two findings drove it, and this time the
starting point was the deployed PNG fetched from Storage rather than a local
render — worth doing first, because it also settled that the round-two template
*had* shipped correctly and the remaining complaint was design, not a stale
image or a cache:

- **A real overflow bug, live.** The Regn tile rendered the dashboard's own
  format, `12.24/s (+128%)`, which overran the tile and spilled a stray `)`
  across the Net End tile beside it. The card now carries a small preview-only
  formatter table keyed by stat id (`PREVIEW_VALUE_FORMAT`) for values whose
  dashboard rendering is too long here. It re-renders `stat.value`; it does not
  recompute it.
- **The skipped-power slots were costing more than they returned.** They were
  ~13px in the embed, and the fade that carried their entire meaning was
  invisible at that size — so a third of the card's height bought nothing. Cut
  them, along with the per-powerset label column (the sets are named in the
  header anyway), and spent the space on 70px icons for the taken powers and on
  type: labels 18→26px, values 38→52px.

Content density is the lever, not type size — a card that must survive a 3×
downscale can only carry so many legible atoms, and the way to make one bigger
is to remove another.

**Sixth round, 2026-09-04 (`CURRENT_PREVIEW_TEMPLATE_VERSION` 6), from a user's
mockup:** the first round that buys density back instead of spending it. Rounds
three through five all paid the toll above by deleting content — v5 was down to
six stat tiles and had dropped both resistance rows. Two changes, and they are a
package rather than two independent edits:

- **Def/res as a bar matrix, not tiles** (`src/utils/preview-defres-bars.ts`).
  A bar carries its value in length, which survives the downscale that
  four-digit type does not, so all nineteen defense/resistance values now fit
  in less card than v5's six tiles spent on six numbers. Nothing is recomputed:
  both the value and the ceiling to scale it against come off the `StatRow`
  `computeAllStats` already produces, so the archetype's resistance cap and the
  context defense softcap arrive from the data rather than a constant.
  A soft-capped bar draws a track 1.4× the cap with a tick at it, because
  `stat-caps.ts` is explicit that defense past the softcap is real and
  load-bearing — clamping the bar would make the card lie about the stat this
  audience reads first. The tick is 2px of near-white; a 1px 40%-opacity rule
  vanished entirely at embed scale in the first render.
- **Powers in Mids pick order, 8 to a column.** A build is at most 24 picks, so
  three columns of eight is exact — no wrapping and no overflow case, and the
  column break lands on a pick boundary. Reading down a column reads up the
  levels, so the card now shows what was taken *and when*. What pays for it is
  laying each power's slots horizontally beside its icon instead of stacked
  underneath: measured, a row went from ~131px to 46px, and eight stacked rows
  (1048px) do not fit in any card under Discord's 4:3 turn. Plus a row of
  inherents, selected by `getSlottedInherents` — having something slotted, not
  by name, so a Celerity in Sprint shows and Rule 0 keeps power names out of
  the conditional.

Card grew 800 → 880 to seat the grid, still under the ~900 (4:3) point where
Discord starts fitting to height. `PREVIEW_CARD_HEIGHT` has three hand-kept
copies — the card, `backfill-preview`, and the **build-og Worker**, whose
og:image:height tag has to move with it or crawlers lay the embed out against
the wrong box.

Measured rather than eyeballed, per the round-two lesson: content height against
card height and each column's last row against the grid's bottom edge
(`getBoundingClientRect`), on a real level-50 24-pick build — 20px of margin, no
clipping — then read back at 400px and 320px. Known residual: the single-letter
bar labels are ~6px at 400px and are not readable there. They are kept anyway —
they cost only width, which the three-column layout has spare, and they resolve
when a viewer opens the image — but the glance-level reading is carried by the
block shapes and the two hues, not by the letters. **Still needs the round-two
verification: an actually posted Discord embed, not a local downscale.**

## Active

- [x] **EMBED1** — Storage bucket + schema: add a `build-previews` Storage
      bucket (public read, write via service role only) and a
      `preview_image_path` column on the shared-builds table, in
      [supabase/schema.sql](../supabase/schema.sql). Fresh-install `CREATE
      TABLE` updated plus a "run on existing databases" migration block
      (bucket insert + `ALTER TABLE` + `shared_builds_with_author` rebuilt —
      a `b.*` view's expansion freezes at creation, so it wouldn't otherwise
      see the new column). `SharedBuild` type updated in
      [src/types/shared.ts](../src/types/shared.ts); `tsc --noEmit` clean.
      **Applied to the live Supabase project 2026-09-03** (user-run in the SQL
      editor) — first attempt hit 42P16 (`CREATE OR REPLACE VIEW` can only
      append a trailing column; `preview_image_path` lands before the
      existing `author_*` columns via `b.*`, which counts as a reorder).
      Fixed to `DROP VIEW` + `CREATE VIEW` (schema.sql corrected to match,
      commit efa5757c39), re-run, both `preview_image_path` and the
      `build-previews` bucket confirmed present.
      verify: file:supabase/schema.sql, fn:preview_image_path
- [x] **EMBED2** — Client-side renderer: **revised in the doing** from a
      hand-rolled `<canvas>` module to reusing this repo's existing
      DOM→PNG "Export as Image" pipeline (`html-to-image` via
      [renderNodeToPng](../src/utils/export-image.ts)) — discovered while
      scoping the data plumbing that `BuildImageCard`/`BuildImageModal`
      already solve taken-power tiles, icon-fallback, and headline-stat
      layout for the exact same inputs (decision 2026-09-03, engineering
      call — reuse over a parallel implementation). Built:
      [BuildPreviewCard.tsx](../src/components/export-image/BuildPreviewCard.tsx)
      (fixed 1200×630, headline stats + taken-vs-skipped primary/secondary
      icon row, taken-only pool/epic row), plus two data helpers —
      [preview-headline-stats.ts](../src/utils/preview-headline-stats.ts)
      (picks `health`/`regeneration`/`defense_*`/`res_smashing`/`res_lethal`
      by id out of `computeAllStats`' output) and
      [build-preview-powers.ts](../src/utils/build-preview-powers.ts)
      (primary/secondary roster taken-vs-skipped via `isBuyablePick` +
      `getPowerset`, matching `AvailablePowers.tsx`'s own filtering).
      Visually verified live in the running app (Playwright): selected a
      real archetype/primary/secondary, took two powers, un-hid the
      off-screen card — headline stats, icons, and the taken/skipped
      contrast all rendered correctly with no console errors. That pass
      caught a real bug — `computeAllStats()` is scoped to `DETAILED_STATS`,
      which deliberately excludes `netend` (it's a dashboard-only tile) — so
      "Net End" was silently missing from the card; fixed by sourcing it
      directly from `globalBonuses.netEndPerSec` as its own prop instead of
      through the generic stat-row lookup.
      verify: file:src/components/export-image/BuildPreviewCard.tsx, fn:BuildPreviewCard
- [x] **EMBED3** — Wired EMBED2 into the share flow. An always-mounted,
      off-screen [SharePreviewCapture](../src/components/export-image/SharePreviewCapture.tsx)
      (mounted in `StatsDashboard.tsx`, unconditionally — unlike
      `BuildImageModal`'s identical off-screen technique, not gated by a
      modal's `isOpen`) keeps a live `BuildPreviewCard` in sync with
      `useBuildStore`; [preview-capture.ts](../src/utils/preview-capture.ts)
      is the singleton bridge letting `shareBuild()` — a plain service
      module, no hooks — grab a rasterized, base64-encoded snapshot via
      `capturePreviewBase64()`. **Revised from the original plan**: the
      upload itself was moved server-side rather than a direct client
      Storage write — `shareBuild()` sends the base64 PNG to the
      `share-build` edge function (both create and update paths, so a
      build's stats changing between shares gets a fresh image), which
      uploads it with the service-role key and sets `preview_image_path`.
      Reason: this repo's whole pattern is mutations going through edge
      functions with server-side ownership/rate-limit checks
      ([schema.sql](../supabase/schema.sql): "No INSERT/UPDATE/DELETE
      policies for anon role"); a direct client Storage write would have
      needed new bucket-level RLS carrying its own ownership logic,
      duplicating what the edge function already enforces. Best-effort
      throughout — a capture or upload failure never blocks the share
      itself (`capturePreviewBase64()`/`uploadPreviewImage()` catch and
      return `null`).
      needs: EMBED1, EMBED2
      verify: file:src/utils/preview-capture.ts, fn:capturePreviewBase64
      **Verified end-to-end against production 2026-09-03**: deployed the
      updated `share-build` function (`supabase functions deploy
      share-build`, user-approved), shared a real test build, and confirmed
      by direct Storage/REST fetch — `preview_image_path` populated
      (`previews/<id>.png`), object publicly fetchable with no auth, and a
      genuine 1200×630 PNG matching the build (headline stats + taken/skipped
      icons). Test row deleted afterward via `delete-build`.
- [x] **EMBED6** — `delete-build` never removed the Storage object, so every
      deleted shared build orphans its preview PNG forever — found while
      cleaning up the EMBED3 verification's own test row (the object stayed
      after the row was gone). On-thesis, not a tangential bug: it's a direct
      consequence of EMBED3's own upload, so it stays in this doc rather than
      being evicted. Fixed with a best-effort `storage.remove()` call after
      the row delete succeeds (deterministic path, no need to read
      `preview_image_path` first; removing a missing object is a no-op).
      **Deployed to production 2026-09-03** (`supabase functions deploy
      delete-build`, user-approved).
      verify: file:supabase/functions/delete-build/index.ts, fn:remove
- [x] **EMBED4** — Cloudflare Worker
      ([workers/build-og/src/index.ts](../workers/build-og/src/index.ts)) on
      the `coh-sidekick.com/builds/*` route, rewriting
      `og:title`/`og:description`/`og:image`/`twitter:*`/`<title>` with
      per-build values. **Two corrections found while building this**:
      (1) the Worker calls the existing `get-build` edge function with the
      public anon key — same point-lookup path the browser already uses for
      unlisted builds — rather than holding its own service-role secret;
      `get-build` already returns null for a private build (`readable`
      check in that function), so the Worker needed no visibility logic of
      its own. (2) **Bigger one**: `fetch(request)` on this route does NOT
      return the app's `index.html` — GitHub Pages' SPA-fallback for any
      unknown path is a bare `404.html` with a client-side
      `location.replace('/')` redirect and NONE of the `og:*` tags (crawlers
      never run that JS). Fixed by fetching the real shell from `/` instead
      and serving the rewritten copy of *that* at the `/builds/:id` URL —
      which incidentally also means a human clicking the link skips the
      redirect round-trip GitHub Pages would otherwise have done.
      Deployed via `npx wrangler deploy` (user did `wrangler login` first,
      account confirmed via `wrangler whoami` / zone lookup).
      needs: EMBED1, EMBED3
      verify: file:workers/build-og/src/index.ts, fn:lookupBuild
- [x] **EMBED5** — End-to-end unfurl check, via `curl` (the Worker does no
      UA-sniffing — it treats every requester identically, so curl's result
      *is* what Discord/Slack's crawler gets, not a proxy for it). Shared a
      real public test build, confirmed
      `coh-sidekick.com/builds/<id>` returns the per-build `og:title`
      (name/AT/sets/level), `og:description`, and `og:image` pointing at the
      real Storage PNG. Confirmed an unknown id falls straight through to
      the generic site-wide tags, untouched — the same code path a private
      build takes (`get-build` returns null for both "doesn't exist" and
      "exists but not readable by this requester"), so this doubles as the
      private-build check without needing a separate private test row. Test
      build deleted afterward.
      needs: EMBED4

## Deferred

- Backfill preview images for builds shared before this feature ships — no
  automatic migration; the owner re-saving/re-sharing the build produces one
  via EMBED3. Gate: revisit if backfill turns out to matter in practice.
- Re-render older previews if the visual template (EMBED2) changes later —
  no versioning/invalidation scheme yet. Gate: revisit if the template changes.

## Out of scope

- Per-power slotting/enhancement detail in the image — decided out in
  §Decision — image content above; not legible at embed size.
- Server-side on-demand rendering — decided out in §Decision — render approach
  above; avoids an unverified WASM-in-Deno dependency and a second stats
  implementation.
- Bot-only conditional rewriting in the Worker — rewriting is unconditional
  instead (see EMBED4); UA sniffing is one more thing to keep in sync with
  crawler UA strings that change over time.
