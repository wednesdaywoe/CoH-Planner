---
project: coh-sidekick
kind: plan
title: Build Share-Preview Image
id-prefix: EMBED
area: shared-builds
created: 2026-09-03
status-ext:
  - "unchecked: no cheap mechanical check available (visual/manual verification)"
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
- [ ] **EMBED4** — Cloudflare Worker on the `coh-sidekick.com/builds/*` route:
      fetch the GitHub Pages origin response and use `HTMLRewriter` to replace
      the static `og:title`/`og:description`/`og:image`/`twitter:image` tags
      with per-build values. **Correction found while building EMBED1**:
      `shared_builds` grants the anon role NO read policy for `unlisted` rows
      (`schema.sql`: "Unlisted rows get NO grant here"), so the Worker can't
      read an unlisted build straight off `shared_builds_with_author` with
      the anon key the way a public one can — it needs the same
      service-role point-lookup path the `get-build` edge function already
      uses (a Worker calling that function, or its own service-role
      Supabase client — service-role secrets in a Cloudflare Worker are an
      environment-variable secret, not exposed to the browser like the
      anon key, so this is safe). Unconditional rewrite for every request on
      the route (no bot-UA sniffing — harmless for humans, avoids UA-list
      fragility). A private build, or a lookup miss, falls through to the
      existing generic site-wide tags already in `index.html` — never emits
      per-build data for a private row.
      needs: EMBED1, EMBED3
      verify: file:workers/build-og/index.ts
- [ ] **EMBED5** — End-to-end unfurl check: confirm a public build's link and
      an unlisted build's link unfurl correctly (Discord/Slack unfurl
      debuggers, or `curl` with a crawler UA), and confirm a private build's
      link still shows only the generic card. No automated crawler-unfurl test
      exists in this stack.
      needs: EMBED4
      @unchecked

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
