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

**satisfied-when:** EMBED1..EMBED5 all `[x]`

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
      **Not yet applied to the live Supabase project** — the migration block
      still needs to be run by hand in the Supabase SQL editor before EMBED3
      can be tested end-to-end.
      verify: file:supabase/schema.sql, fn:preview_image_path
- [ ] **EMBED2** — Client-side renderer: a `renderPreviewImage(build)` module
      that composites archetype/sets/level, headline stats, and the compact
      taken/skipped power icon row onto a `<canvas>` (OG-standard 1200×630) and
      resolves a PNG `Blob`.
      verify: file:src/services/buildPreviewImage.ts, fn:renderPreviewImage
- [ ] **EMBED3** — Wire EMBED2 into the share flow: after a successful
      `shareBuild()` (both create and update/re-share paths, since an existing
      build's stats can change), render the image, upload it to
      `previews/<id>.png` in the EMBED1 bucket, and persist the path on the
      row. Best-effort like the existing favorites mirror (§sharedBuilds.ts) —
      an upload failure must not break the primary share action.
      needs: EMBED1, EMBED2
      verify: fn:uploadPreviewImage
- [ ] **EMBED4** — Cloudflare Worker on the `coh-sidekick.com/builds/*` route:
      fetch the GitHub Pages origin response and use `HTMLRewriter` to replace
      the static `og:title`/`og:description`/`og:image`/`twitter:image` tags
      with per-build values, read from the public `shared_builds_with_author`
      view by id. Unconditional rewrite for every request on the route (no
      bot-UA sniffing — harmless for humans, avoids UA-list fragility). A
      private build, or a lookup miss, falls through to the existing generic
      site-wide tags already in `index.html` — never emits per-build data for
      a private row.
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
