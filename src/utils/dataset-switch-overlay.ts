/**
 * Full-screen "switching dataset" overlay.
 *
 * The active dataset is a boot-time singleton (see `data/dataset.ts`) that
 * can't be hot-swapped, so changing servers — whether via the header dropdown
 * or importing a build from a different server — requires a page reload. The
 * post-reload boot pulls a fresh chunk graph (powersets + IO sets + AT tables)
 * and can take a beat. Drop this over the page first so the user gets immediate
 * feedback that something's happening; it survives until the new page paints
 * over it.
 *
 * `serverLabel` comes from trusted dataset metadata (never user input), so the
 * innerHTML interpolation carries no injection risk.
 */
export function showDatasetSwitchOverlay(serverLabel: string): void {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:99999',
    'background:rgba(15,23,42,0.92)', 'backdrop-filter:blur(2px)',
    'display:flex', 'flex-direction:column',
    'align-items:center', 'justify-content:center',
    'gap:18px', 'color:#e2e8f0',
    "font-family:'SN Pro','Nunito',system-ui,sans-serif",
  ].join(';');
  overlay.innerHTML = `
    <div style="width:48px;height:48px;border:3px solid #1e293b;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <div style="font-size:18px;font-weight:600;">Switching to ${serverLabel}…</div>
    <div style="font-size:13px;color:#94a3b8;max-width:320px;text-align:center;line-height:1.45;">
      Loading the new dataset. This can take a moment on first switch.
    </div>
  `;
  document.body.appendChild(overlay);
}
