**Project: Sidekick reliability improvements**

Three connected features: PWA with update prompt, Sentry error monitoring, and a status banner fed by an external JSON endpoint. Implement in this order — each is independent but they build on each other logically.

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