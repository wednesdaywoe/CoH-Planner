---
project: coh-sidekick
kind: plan
title: Backfill Build Preview Images
id-prefix: PREVBF
area: shared-builds
created: 2026-09-03
relates:
  - BUILD_PREVIEW_IMAGE_PLAN.md
  - OPEN_ITEMS.md
---

# Backfill Build Preview Images

Follow-on to [BUILD_PREVIEW_IMAGE_PLAN.md](BUILD_PREVIEW_IMAGE_PLAN.md) (closed
2026-09-03), which only produces a preview image at share time (EMBED3). Every
build shared *before* that shipped — the whole HC Brainstorm import, plus
anything shared/updated by any means that isn't the live app's Share button
(Copy Link, metadata Edit, visibility toggle) — has `preview_image_path: null`
forever and will keep unfurling with the generic site-wide image. Confirmed
live 2026-09-03 against three real pre-existing builds (`TIZbOh3wV5`,
`OdCM_Drr9R`, `L-Szyl6zcY`) — none of the actions available on
`BuildDetailPage` call `shareBuild()`/`capturePreviewBase64()`, so none of
them ever populate the column no matter how many times the link is copied.

**Widened 2026-09-03, same day, before any code landed:** EMBED's own
"Deferred" section named a second, related gap — "re-render older previews if
the visual template changes later... revisit if the template changes" — and
gated it on the template actually changing. It just did (the EMBED2
legibility fix, commit `614261b342`, bigger type/icons on the same 1200×630
layout), and the user hit it immediately: a build shared under the old
template still shows the old small-text image indefinitely, confirmed live
(bundle check showed the deployed JS is current; the stale image is real, not
a caching artifact of the fix itself). A *missing* image and a *stale* image
are the same user-facing failure — "this build's image doesn't reflect
reality" — and the fix for one is 90% the fix for the other (same capture
pipeline, same isolation mechanism, same trigger point); building
missing-only now and bolting on staleness right after would just be rework.
Widening the thesis rather than opening a third doc.

**Thesis:** a public or unlisted build's preview image is generated when
missing and refreshed when it was rendered under an older visual template
than the one live today — both automatically, in an isolated hidden capture
pass the next time any browser views its `/builds/:id` page — without
visibly affecting that browser's own UI or touching that browser's own
locally-saved build.

**satisfied-when:** PREVBF1..PREVBF8 all `[x]`

## Preconditions

Checked now (cheap, code-derived):
- EMBED1–6 all shipped and live — this doc's whole mechanism reuses
  `SharePreviewCapture`/`BuildPreviewCard`/`capturePreviewBase64()`/the
  `build-previews` bucket unmodified; nothing here re-implements rendering.
- `buildStore`'s `persist` middleware writes to a single fixed `localStorage`
  key (`'coh-planner-build'`), with no cross-tab `BroadcastChannel` —
  confirmed in [src/stores/buildStore.ts](../src/stores/buildStore.ts)
  (`name: 'coh-planner-build'`, plain `createJSONStorage(() => localStorage)`).
  This is the fact the isolation decision below leans on: writes are
  same-origin, always-on (`persist` writes on every state change), and
  visible to every tab only via that one shared key.
- `StatsDashboard` (and therefore `SharePreviewCapture`) is mounted inside
  `MainLayout`, which wraps *every* route via the root route's `Outlet` —
  confirmed in [src/router.tsx](../src/router.tsx) and
  [MainLayout.tsx](../src/components/layout/MainLayout.tsx). `MainLayout`
  also renders live store state app-wide (header build name/archetype/sets),
  confirmed live via Playwright. This is why hijacking the *visible* tab's
  store (see Decision below) was rejected, not just theorized about.
- `getSharedBuild(id)` is already callable with no auth, by any visitor —
  confirmed (it's what `BuildDetailPage` calls today for anyone).

## Decision — isolation mechanism (2026-09-03, engineering call)

A hidden same-origin `<iframe>` boots a **fresh instance of the app** in a
"capture mode" (own JS realm, own module state, own `useBuildStore`
instance) to render and capture the backfill target, rather than importing
it into the *visible* tab's singleton store and restoring it afterward.

Rejected: same-tab store hijack (`importBuild()` the target, capture, restore
the original state). Two independent reasons, not one: (1) `MainLayout`
renders live store state app-wide, so even a brief hijack would flicker the
wrong build's name/archetype into the header for every visitor who happens to
land on an un-imaged build's page — user-visible breakage for a feature that
is supposed to be invisible; (2) `persist` writes the hijacked state to the
visitor's *real* `localStorage` key on every change, so the hijack window is
a real (if narrow) data-loss risk — a crash or tab-close mid-window would
permanently leave the backfill target sitting in that visitor's own saved
build slot. An invisible background feature has no business risking someone
else's actual work.

## Decision — capture-mode storage (2026-09-03, engineering call)

`buildStore`'s `persist` `storage` adapter swaps to an in-memory stub
(never touches real `localStorage`) whenever the app boots with the
capture-mode URL param present. Confined to `buildStore.ts`'s persist config
— this is what makes `importBuild()` safe *inside* the iframe even though
it's technically the same origin: capture-mode boots simply never write to
the shared key, regardless of iframe isolation.

## Decision — anonymous-write security (2026-09-03, user-chosen; widened same
day for versioning)

Any visitor's view can trigger a write, with no owner check — that's the
whole point of "automatic on view." To bound the abuse surface: **write-once
per template version** (the backend only writes when the row's stored
`preview_template_version` is behind the version live today — never when it's
already current) plus a **server-side shape check** (decoded bytes must be a
valid PNG, exactly 1200×630, under the existing `MAX_PREVIEW_IMAGE_BYTES`
cap). This is the null-only "write-once" from the original decision,
generalized: a never-generated row (`preview_image_path IS NULL`) is just the
`preview_template_version IS NULL` case. Rejected: restricting the trigger to
owner-only views (closes the surface entirely but defeats the point — a
build only backfills when its owner happens to revisit it) and a per-build
rate limit on top (blunts rapid racing but doesn't close anything the shape
check doesn't already bound). Accepted residual risk: a determined attacker
running a modified client could still plant one wrong-but-correctly-shaped
image before the real one generates for that version, since there's no way to
verify image *content* server-side without the on-demand server-render
approach EMBED already rejected (unverified WASM-in-Deno) — and now that
regeneration is version-gated rather than one-shot-forever, that attacker
gets a fresh opportunity on every future template bump, not just once. Judged
acceptable: still cosmetic-only, still narrow, and an owner re-sharing via
EMBED3 is a separate, unrestricted write that always wins regardless of what
this path last wrote.

## Active

- [ ] **PREVBF1** — schema + version constant: add
      `preview_template_version INTEGER` to `shared_builds` (migration in
      [supabase/schema.sql](../supabase/schema.sql), existing rows land `NULL`
      — indistinguishable from "never generated" by design, since a `NULL`
      path already means that). Define
      `CURRENT_PREVIEW_TEMPLATE_VERSION = 1` as a literal constant, duplicated
      (frontend + every edge function that writes the column, same pattern as
      `MAX_PREVIEW_IMAGE_BYTES`) with a comment: bump this by hand, in every
      copy, whenever `BuildPreviewCard`'s visual template changes.
      verify: file:supabase/schema.sql, fn:preview_template_version
- [ ] **PREVBF2** — stamp the version on real shares too: `share-build`'s
      `uploadPreviewImage` sets `preview_template_version =
      CURRENT_PREVIEW_TEMPLATE_VERSION` alongside `preview_image_path` on both
      the create and update branches, so an owner's normal re-share also
      keeps the version current — not just this doc's new capture path.
      Deploy via `supabase functions deploy share-build` (production push —
      confirm with the user first).
      needs: PREVBF1
      verify: file:supabase/functions/share-build/index.ts, fn:uploadPreviewImage
- [ ] **PREVBF3** — `buildStore` capture-mode storage swap: detect the
      capture-mode URL param at store-creation time; when present, `storage:`
      resolves to an in-memory `Storage`-shaped stub instead of `localStorage`.
      verify: file:src/stores/buildStore.ts, fn:createJSONStorage
- [ ] **PREVBF4** — `main.tsx` capture-mode boot: recognize
      `?previewCapture=<id>&serverId=<sid>`, fetch the target via
      `getSharedBuild(id)`, call `importBuild()` with its `build_json`, let
      the app render normally (no confirmation dialog, no navigation — this
      path never goes through `BuildDetailPage`'s `handleLoadBuild`).
      needs: PREVBF3
      verify: file:src/main.tsx, fn:importBuild
- [ ] **PREVBF5** — capture + report, run from inside the capture-mode boot:
      poll until the calc stack (`useCalculatedStats`/`useCharacterCalculation`)
      stabilizes or a hard cap elapses, call `capturePreviewBase64()`, POST the
      result to PREVBF6's endpoint, then `postMessage` a completion signal to
      `window.parent` (origin-checked). A capture that never stabilizes or
      fails to upload still posts completion (or the parent's own timeout in
      PREVBF7 governs it) — this must never hang the hidden iframe forever.
      needs: PREVBF4
      verify: file:src/components/export-image/SharePreviewCapture.tsx, fn:capturePreviewBase64
- [ ] **PREVBF6** — new edge function
      `supabase/functions/backfill-preview/index.ts`: `{id, preview_image_base64}`,
      no auth. Validates the row exists, `visibility !== 'private'`, the
      row's stored `preview_template_version` is `NULL` or `<
      CURRENT_PREVIEW_TEMPLATE_VERSION` (version-gated write — never when
      already current), decoded PNG is exactly 1200×630 (read the IHDR chunk)
      and within `MAX_PREVIEW_IMAGE_BYTES`. Uploads to the existing
      `build-previews` bucket at the existing `previews/<id>.png` convention
      and sets both `preview_image_path` and `preview_template_version` —
      reusing EMBED3's `uploadPreviewImage` shape rather than a parallel
      implementation. Deploy via `supabase functions deploy backfill-preview`
      (production push — confirm with the user first).
      needs: PREVBF1
      verify: file:supabase/functions/backfill-preview/index.ts, fn:uploadPreviewImage
- [ ] **PREVBF7** — wire the trigger into `BuildDetailPage`: on load, if
      `build.visibility !== 'private'` and (`preview_image_path` is null or
      `preview_template_version` is null or behind
      `CURRENT_PREVIEW_TEMPLATE_VERSION`), mount a hidden `<iframe>` at
      `/?previewCapture=<id>&serverId=<serverId>`; remove it on the
      completion `postMessage` or a hard timeout (~20s). Dedupe per pageview
      so re-renders don't spawn a second iframe.
      needs: PREVBF5, PREVBF6
      verify: file:src/pages/BuildDetailPage.tsx, fn:previewCapture
- [ ] **PREVBF8** — end-to-end verification against production, both cases:
      (a) a build missing a preview image entirely, (b) a build with a
      preview image already, minted under an older template version (e.g. one
      of today's real test builds). For each: no visible UI flicker/glitch on
      the visiting tab during the capture window, the visiting tab's own
      saved build in `localStorage` is byte-identical before/after,
      `preview_image_path`/`preview_template_version` populate/advance within
      the expected window, the Worker (EMBED4) now serves the correct
      `og:image`, and a second view afterward does not re-trigger (version
      gate holds — confirm via network tab).
      needs: PREVBF7
      verify: @unchecked

## Out of scope

- Restricting the trigger to owner-only views — decided against in
  §Decision — anonymous-write security; defeats "automatic on view."
- A server-side rate limit per build id beyond version-gated write — decided
  against in the same section; the version gate plus shape check was judged
  sufficient.
- Retrying a failed backfill/refresh attempt on a schedule — no dedicated
  retry/backoff. A failed attempt just leaves the row behind, and the next
  organic view tries again for free.
- A migration script to bulk-stamp every pre-existing row's
  `preview_template_version` — unnecessary; `NULL` already means "generate
  regardless of version," which is the correct behavior for every row that
  predates this column.
