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

**Thesis:** a public or unlisted build with no preview image gets one
automatically — generated in an isolated, hidden capture pass the next time
any browser views its `/builds/:id` page — without visibly affecting that
browser's own UI or touching that browser's own locally-saved build.

**satisfied-when:** PREVBF1..PREVBF6 all `[x]`

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

## Decision — anonymous-write security (2026-09-03, user-chosen)

Any visitor's view can trigger a write, with no owner check — that's the
whole point of "automatic on view." To bound the abuse surface: **write-once**
(the backend only fills a currently-`null` `preview_image_path`, never
overwrites one that already exists) plus a **server-side shape check**
(decoded bytes must be a valid PNG, exactly 1200×630, under the existing
`MAX_PREVIEW_IMAGE_BYTES` cap). Rejected: restricting the trigger to
owner-only views (closes the surface entirely but defeats the point — a
build only backfills when its owner happens to revisit it) and a per-build
rate limit on top (blunts rapid racing but doesn't close anything the shape
check doesn't already bound). Accepted residual risk: a determined attacker
running a modified client could still plant one wrong-but-correctly-shaped
image before the real one generates, since there's no way to verify image
*content* server-side without the on-demand server-render approach EMBED
already rejected (unverified WASM-in-Deno). Narrow and self-correcting — an
owner re-sharing via the existing EMBED3 path is a separate, unrestricted
write that always wins regardless of what this path last wrote.

## Active

- [ ] **PREVBF1** — `buildStore` capture-mode storage swap: detect the
      capture-mode URL param at store-creation time; when present, `storage:`
      resolves to an in-memory `Storage`-shaped stub instead of `localStorage`.
      verify: file:src/stores/buildStore.ts, fn:createJSONStorage
- [ ] **PREVBF2** — `main.tsx` capture-mode boot: recognize
      `?previewCapture=<id>&serverId=<sid>`, fetch the target via
      `getSharedBuild(id)`, call `importBuild()` with its `build_json`, let
      the app render normally (no confirmation dialog, no navigation — this
      path never goes through `BuildDetailPage`'s `handleLoadBuild`).
      needs: PREVBF1
      verify: file:src/main.tsx, fn:importBuild
- [ ] **PREVBF3** — capture + report, run from inside the capture-mode boot:
      poll until the calc stack (`useCalculatedStats`/`useCharacterCalculation`)
      stabilizes or a hard cap elapses, call `capturePreviewBase64()`, POST the
      result to PREVBF4's endpoint, then `postMessage` a completion signal to
      `window.parent` (origin-checked). A capture that never stabilizes or
      fails to upload still posts completion (or the parent's own timeout in
      PREVBF5 governs it) — this must never hang the hidden iframe forever.
      needs: PREVBF2
      verify: file:src/components/export-image/SharePreviewCapture.tsx, fn:capturePreviewBase64
- [ ] **PREVBF4** — new edge function
      `supabase/functions/backfill-preview/index.ts`: `{id, preview_image_base64}`,
      no auth. Validates the row exists, `visibility !== 'private'`,
      `preview_image_path IS NULL` (write-once), decoded PNG is exactly
      1200×630 (read the IHDR chunk) and within `MAX_PREVIEW_IMAGE_BYTES`.
      Uploads to the existing `build-previews` bucket at the existing
      `previews/<id>.png` convention and sets `preview_image_path` — reusing
      EMBED3's `uploadPreviewImage` shape rather than a parallel
      implementation. Deploy via `supabase functions deploy backfill-preview`
      (production push — confirm with the user first, per this project's
      established pattern for edge-function deploys).
      needs: EMBED1
      verify: file:supabase/functions/backfill-preview/index.ts, fn:uploadPreviewImage
- [ ] **PREVBF5** — wire the trigger into `BuildDetailPage`: on load, if
      `build.preview_image_path` is null and `build.visibility !== 'private'`,
      mount a hidden `<iframe>` at `/?previewCapture=<id>&serverId=<serverId>`;
      remove it on the completion `postMessage` or a hard timeout (~20s).
      Dedupe per pageview so re-renders don't spawn a second iframe.
      needs: PREVBF3, PREVBF4
      verify: file:src/pages/BuildDetailPage.tsx, fn:previewCapture
- [ ] **PREVBF6** — end-to-end verification against production on a real
      pre-existing build missing a preview image: (a) no visible UI
      flicker/glitch on the visiting tab during the capture window, (b) the
      visiting tab's own saved build in `localStorage` is byte-identical
      before/after, (c) `preview_image_path` populates within the expected
      window, (d) the Worker (EMBED4) now serves the correct `og:image` for
      that build's URL, (e) a second view afterward does not re-trigger
      (write-once holds — confirm via network tab, no second POST attempt
      needed since the client already gates on `preview_image_path` being
      null).
      needs: PREVBF5
      verify: @unchecked

## Out of scope

- Restricting the trigger to owner-only views — decided against in
  §Decision — anonymous-write security; defeats "automatic on view."
- A server-side rate limit per build id beyond write-once — decided against
  in the same section; write-once + shape check was judged sufficient.
- Re-rendering previews when the visual template (EMBED2) changes later —
  the *other* item EMBED deferred; unrelated to backfilling missing images,
  still not addressed by this doc either.
- Retrying a failed backfill attempt on a schedule — no dedicated
  retry/backoff. A failed attempt just leaves `preview_image_path` null,
  and the next organic view tries again for free.
