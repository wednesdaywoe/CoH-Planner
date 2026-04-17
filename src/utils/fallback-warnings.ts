/**
 * Fallback warning helper.
 *
 * Logs when code silently substitutes a default/guessed value for missing data.
 * The planner handles rich game data where "wrong but plausible" is the most
 * dangerous failure mode — these warnings surface those substitutions to the
 * console so maintainers and power users can catch data bugs that would
 * otherwise look fine.
 *
 * Warnings are deduplicated per unique (site, detail) so a single bad power
 * doesn't flood the console.
 *
 * Enabled by default. Toggle via window.cohDebug.warnings.{enable,disable,clear}.
 */

const STORAGE_KEY = 'coh-fallback-warnings';

let _enabled = true;
const _seen = new Set<string>();

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'false') _enabled = false;
} catch { /* SSR or storage unavailable */ }

/**
 * Log a fallback once per unique (site, detail) pair.
 * `site` is a short stable identifier for the code location (e.g., "getTableValue").
 * `detail` describes what was substituted (e.g., "table 'Ranged_Damage' missing for 'defender'").
 * `extra` is optional structured context to print alongside.
 */
export function warnFallback(site: string, detail: string, extra?: unknown): void {
  if (!_enabled) return;
  const key = `${site}::${detail}`;
  if (_seen.has(key)) return;
  _seen.add(key);
  if (extra !== undefined) {
    console.warn(`[CoH Fallback] ${site}: ${detail}`, extra);
  } else {
    console.warn(`[CoH Fallback] ${site}: ${detail}`);
  }
}

function enableFallbackWarnings(): void {
  _enabled = true;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  console.log('%c[CoH Fallback] Warnings ENABLED', 'color: #fbbf24; font-weight: bold');
}

function disableFallbackWarnings(): void {
  _enabled = false;
  try { localStorage.setItem(STORAGE_KEY, 'false'); } catch { /* noop */ }
  console.log('%c[CoH Fallback] Warnings DISABLED', 'color: #9ca3af');
}

function clearFallbackWarnings(): void {
  _seen.clear();
  console.log('%c[CoH Fallback] Deduplication cache cleared', 'color: #9ca3af');
}

function statusFallbackWarnings(): void {
  console.log(
    `%c[CoH Fallback] ${_enabled ? 'ENABLED' : 'DISABLED'} — ${_seen.size} unique warning(s) emitted this session`,
    _enabled ? 'color: #fbbf24; font-weight: bold' : 'color: #9ca3af'
  );
}

if (typeof window !== 'undefined') {
  // Mutate the existing cohDebug hub (declared in calc-debug.ts) in-place so
  // whichever module loads later doesn't overwrite the other's registrations.
  const hub = (window.cohDebug ??= {} as Window['cohDebug']);
  hub.warnings = {
    enable: enableFallbackWarnings,
    disable: disableFallbackWarnings,
    clear: clearFallbackWarnings,
    status: statusFallbackWarnings,
  };
}
