**Project: Sidekick reliability improvements**

Three connected features: PWA with update prompt, Sentry error monitoring, and a status banner fed by an external JSON endpoint. Implement in this order — each is independent but they build on each other logically.

**Status (2026-06-12):** Phase 1 (Sentry) ✅ shipped · Phase 2 (status banner) ✅ shipped · Phase 3 (PWA) — ✅ implemented (builds green, SW generates; needs manual update-flow verification via `vite preview` before/after deploy). See plan at bottom.

---

**Phase 1 — Sentry**

Install and configure Sentry for production error monitoring.

- Install `@sentry/react` and `@sentry/vite-plugin`
- Initialize Sentry in `main.tsx` before the React root mounts. DSN will be provided as an environment variable `VITE_SENTRY_DSN`
- Wrap the app with `Sentry.ErrorBoundary` as a fallback for unhandled render errors
- Add the Sentry Vite plugin to `vite.config.ts` for source map uploads — this requires a `SENTRY_AUTH_TOKEN` environment variable, which should be added to the CI/deploy pipeline but not committed
- Only initialize when `import.meta.env.PROD` is true — do not run Sentry in development

---

**Phase 2 — Status banner**

A lightweight banner that appears when Sidekick has a known issue. Depends on an external status endpoint that is independent of the main Sidekick deploy.

The status endpoint will be a separate GitHub Pages repo serving a static `status.json` file at a stable URL (TBD — will be provided before implementation). Its shape is:

```json
{
  "status": "ok",
  "message": null
}
```

During an incident, `status` will be set to `"degraded"` or `"down"` and `message` will contain a human-readable explanation.

Implementation notes:
- Create a `useStatusCheck` hook that fetches the status JSON on app load
- Fetch should be fire-and-forget — if the request fails for any reason (network, CORS, endpoint unreachable) it should fail silently with no visible effect on the app
- If `status` is anything other than `"ok"`, render a banner at the top of the app with the `message` value
- The banner should be dismissible per-session (sessionStorage is fine — if they reload they'll see it again, which is acceptable)
- Do not poll repeatedly — a single fetch on mount is sufficient. Users who have the app open during an incident will see it on their next load or refresh
- The banner styling should use existing Sidekick design tokens — this is not a high-priority visual element, just clearly visible and non-disruptive

---

**Phase 3 — PWA**

Convert Sidekick to a Progressive Web App using `vite-plugin-pwa`. The goal is local cacheability and an explicit user-controlled update prompt — not silent auto-updates.

- Install `vite-plugin-pwa`
- Configure the plugin in `vite.config.ts`:
  - `registerType: 'prompt'` — do not use `'autoUpdate'`. Updates should require user confirmation
  - Cache strategy: `NetworkFirst` for HTML, `CacheFirst` for static assets (JS, CSS, images). This ensures users always try to get a fresh app shell when online, falling back to cache when offline
  - Include the app icon and any existing favicon assets in the PWA manifest
- Create a small `UpdatePrompt` component using the `useRegisterSW` hook from `vite-plugin-pwa/client`:
  - When `needRefresh` is true, show a non-blocking prompt (toast or small banner) informing the user a Sidekick update is available
  - Provide a "Update now" button that calls `updateServiceWorker(true)` and reloads
  - Provide a dismiss option — do not force the update
  - Place this component near the app root so it's always rendered regardless of which view is active
- The PWA manifest should set `name`, `short_name`, `theme_color`, and `background_color` consistent with Sidekick's existing branding. Icon assets will need to be provided or generated — flag this if the correct source assets aren't present in the repo

---

**Not in scope for this pass**

- The GitHub Pages status repo itself — that will be set up separately and the URL provided before Phase 2 implementation
- Push notifications or any active alerting to users
- Any changes to the existing in-app bug reporting flow

---

## Phase 3 — Implementation plan (scoped 2026-06-12)

Phases 1 (Sentry) and 2 (status banner) are shipped. This section is the concrete plan for Phase 3, written after auditing what's already in the repo.

### What already exists (so this phase is smaller than it looks)

The app is already "PWA-shaped" — the only genuinely missing piece is a **service worker**:

- **Manifest** — `public/manifest.json` is complete: `name`, `short_name`, `theme_color` (#3b82f6), `background_color` (#111827), icons, `display: standalone`, and a `file_handlers` entry for `.skif`. Linked in `index.html`. **No icon assets need generating** — favicon-192/256/512 all exist in `public/img/`.
- **`.skif` file association** — `main.tsx` already wires `launchQueue` to import opened `.skif` files. This code is currently **dormant**: file handlers only fire for an *installed* PWA, which requires a service worker. Adding the SW activates an already-written feature.
- **Update detection** — `useUpdateChecker.ts` polls `version.json` every 5 min and drives the amber `UpdateBanner` (wired in `MainLayout.tsx:83`). This is the system we are replacing.
- **Stale-chunk recovery** — `chunk-error-reload.ts` auto-reloads when a stale tab 404s on an old hashed chunk after a deploy. This was a band-aid for *not having a SW*; the SW is the root fix.

### Locked decisions

1. **Replace** `version.json` polling with the SW's `needRefresh` lifecycle signal.
2. **Simplify** — collapse the redundant update/stale-chunk machinery now that the SW is the root fix.
3. Keep the hand-written `manifest.json` (`manifest: false` in the plugin); precache the app shell + JS/CSS chunks only; runtime-cache images.

### Cache strategy (matched to how this app loads data)

- **Datasets** (Homecoming/Rebirth) are bundled JS modules under `src/data/datasets/<id>/`, code-split into hashed chunks — covered by normal precache. No special rule.
- **`public/img/`** holds hundreds of enhancement/archetype icons. **Do NOT precache** (would download the whole icon library on SW install). Runtime `CacheFirst` with an expiration cap instead.
- **`version.json` / `status.json`** → `NetworkOnly` (or NetworkFirst, no-store). Caching them defeats incident/update detection. (After the replace, `version.json` is deleted anyway — but `status.json` stays and must not be cached.)
- **HTML shell** → precached, served to navigations via `navigateFallback`. *Deviation from the original Phase 3 note's "NetworkFirst for HTML":* with `registerType: 'prompt'` the controlled update flow is precache-driven — the waiting SW carries the new `index.html` and the prompt activates it. NetworkFirst HTML would fetch a fresh shell referencing new chunk hashes the current SW hasn't precached, reintroducing the exact stale-chunk failure we're eliminating. Precache-backed navigations + the prompt is the coherent model; freshness is owned by the prompt, not per-navigation revalidation.
- **JS/CSS chunks** → precache (CacheFirst via Workbox precache manifest). Per-file cap raised to 16 MiB — the dataset bundle is a single ~11 MB chunk that boot loads before render anyway, so precaching it adds ~no first-load cost. Verified at build: 9 precache entries (shell HTML/CSS/JS), zero images. Revisit the cap if the bundle keeps growing (Thunderspy etc.) — eventually runtime-caching the data chunk on demand beats precaching it.

### Work breakdown

1. `npm i -D vite-plugin-pwa`
2. **vite.config.ts** — add `VitePWA({ registerType: 'prompt', manifest: false, workbox: { ... } })`:
   - `globPatterns` for the precache: JS/CSS/HTML only — exclude `img/**`.
   - `runtimeCaching`: CacheFirst+expiration for `img/`, NetworkFirst/NetworkOnly for `status.json`.
   - Remove the `versionFilePlugin` (it only writes `version.json`, which the replace makes dead). **Keep** the `__BUILD_TIME__` define — it's separate and still feeds version display.
3. **UpdateBanner** — repoint from `useUpdateChecker` to `useRegisterSW` from `virtual:pwa-register/react`:
   - `needRefresh` → `visible`; the "Refresh" button → `updateServiceWorker(true)` instead of `window.location.reload()`.
   - Keep the existing amber-banner UI and the "learn more" → WelcomeModal link as-is.
   - Put the `useRegisterSW` call in `MainLayout` (replacing the `useUpdateChecker()` call at line 47), or a thin `usePwaUpdate` hook for symmetry.
4. **Delete** `useUpdateChecker.ts`, `public/version.json`, and the `versionFilePlugin` block. Confirm `BUILD_TIME`/`buildTime.ts` and its consumers (Header, WelcomeModal, diagnostics) are untouched — they use `__BUILD_TIME__`, not `version.json`.
5. **chunk-error-reload** — slim it down (decided). The SW (prompt mode + precache) keeps old chunks served from cache, so the 404 path it guards against is gone for SW-controlled tabs. Residual exposure: a deploy landing during a user's *very first* session, before the SW controls the page. So:
   - Strip the parts of `chunk-error-reload.ts` that duplicate the new update messaging (the "new version available — reloading" toast).
   - Keep only the minimal auto-reload-once safety for the uncontrolled-page (first-session-during-deploy) case.
   - Do not delete the file outright — the trimmed guard preserves first-session safety with no blank-screen risk.
6. **Add `<link rel="manifest">` check** — already present in `index.html`; verify the plugin doesn't inject a duplicate.

### Testing notes

- The SW update flow **cannot be tested with `vite dev`** — service workers need a built bundle. Use `npm run build && npm run preview`, then DevTools → Application → Service Workers.
- Verify the update cycle: load preview → rebuild with a change → reload once (registers waiting SW) → confirm `UpdateBanner` appears → click Refresh → confirm new build activates.
- Verify offline: DevTools → Network → Offline → reload → app shell loads from cache.
- Verify `.skif` association only after an actual install (Chrome → Install Sidekick), since that's the dormant feature this activates.

### Estimate

~Half a day, most of it in SW update-flow verification (notoriously fiddly) rather than code. The config + the banner repoint are small.

### Add-on (post-scope): in-app install discoverability

Browsers only surface PWA install via subtle native UI (Chromium address-bar icon, iOS manual Share-sheet), so few users find it. Added a quiet **"Install app"** item to the Action Menu (`Header.tsx`), driven by `usePwaInstall` (`src/hooks/usePwaInstall.ts`):

- Listens for `beforeinstallprompt`, suppresses the browser's default banner, stashes the event; the menu item calls `event.prompt()` on click.
- Shown only when installable and not already installed (`display-mode: standalone` / `appinstalled` guard); single-use (clears after prompting).
- **Chromium-only** by nature — `beforeinstallprompt` doesn't fire on Safari/Firefox, so the item simply stays hidden there. iOS Share-sheet hint was explicitly out of scope for this pass.
- Verified under `vite preview` with a synthetic event: item absent by default → appears on event → click fires the prompt → menu closes → item disappears after use.