/**
 * Thunderspy Primalist form-redirect resolver.
 *
 * The Primalist is a Kheldian-style form-shifter. Its Feral Might attacks
 * (and Primal Gift's Primal Howl) are EMPTY redirect shells in the pickable
 * powersets — the real effect data lives in per-form variants
 * (`<Power>_Primal` / `_Hunter` / `_Prowler`) under `Primalist_Misc`. Which
 * variant's numbers apply is decided by the active form. Unlike Kheldians,
 * there is no "own data" default form: even Primal (the human/default form)
 * redirects to the `_Primal` variant, because the base shell has no effects.
 *
 * Slots/enhancements live on the base shell power; all form variants share
 * them (display-only overlay, exactly like the Rebirth Kheldian model).
 *
 * The redirect table + variant power data are generated — see
 * `scripts/generate-primalist-variants.cjs` → `primalist-form-variants.ts`.
 */

import { PRIMALIST_REDIRECTS, PRIMALIST_FORM_VARIANT_POWERS } from './primalist-form-variants';

export type PrimalistForm = 'primal' | 'hunter' | 'prowler';

/** The form the planner shows when none is chosen (human/base shape). */
export const DEFAULT_PRIMALIST_FORM: PrimalistForm = 'primal';

/**
 * Resolve a base power's internalName to the variant internalName that fires
 * in the given form. Returns the base name unchanged for powers that aren't
 * form shells. A `null` form entry falls back to the Primal variant (and then
 * to the base name) so a form that lacks a specific variant still resolves.
 */
export function resolvePrimalistRedirect(
  baseInternalName: string,
  form: PrimalistForm,
): string {
  const targets = PRIMALIST_REDIRECTS[baseInternalName];
  if (!targets) return baseInternalName;
  return targets[form] ?? targets.primal ?? baseInternalName;
}

/** True when a power redirects to form variants (i.e. is a form shell). */
export function isPrimalistFormShell(baseInternalName: string): boolean {
  return baseInternalName in PRIMALIST_REDIRECTS;
}

export { PRIMALIST_FORM_VARIANT_POWERS };

/** Internal-name set of all form-variant powers (redirect targets only). */
export const PRIMALIST_FORM_VARIANT_NAMES = new Set<string>(
  Object.keys(PRIMALIST_FORM_VARIANT_POWERS),
);
