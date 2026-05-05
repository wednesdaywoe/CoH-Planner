/**
 * Rebirth Kheldian PowerRedirector mappings.
 *
 * In Rebirth, Kheldian form mechanics use the game's PowerRedirector
 * system: a human-form base power has multiple redirect targets, and
 * which one fires is decided at activation time based on the current
 * form (Human / Nova / Dwarf). All slots and enhancements live on the
 * base (human) power; form variants share them.
 *
 * For build-editing this means: the human-form powers are the only
 * slottable picks. Form-specific variants (Bright_Nova_Bolt, etc.) are
 * NOT separate user picks — they only appear as redirect targets here.
 *
 * Source of truth: Utpal's mapping (community member familiar with
 * Rebirth internals), captured 2026-05-04. See
 * [REBIRTH_DATA_GAPS.md](../../../REBIRTH_DATA_GAPS.md) §3 for full
 * context and the deferred Parse6 parser work that would let us
 * extract this from `powers.bin` directly.
 *
 * Format note: targets use the full-name path under `Kheldian_Pets.*`
 * (where Rebirth stores form variants), NOT the path under the human
 * powerset. "Falls through to Human" cases are encoded as `null` —
 * meaning that form re-uses the human variant.
 */

export type KheldianForm = 'human' | 'nova' | 'dwarf';

export interface KheldianRedirectTargets {
  /** When in Human form, this is the variant that fires. */
  human: string;
  /** When in Nova form. `null` = falls through to Human. */
  nova: string | null;
  /** When in Dwarf form. `null` = falls through to Human. */
  dwarf: string | null;
}

/**
 * Maps a base power's INTERNAL NAME to its per-form redirect target
 * INTERNAL NAMES.
 *
 * Keys are the human-form base power internal names (e.g.
 * `Gleaming_Bolt`). Values give the form-variant power's internalName
 * that should be looked up in the same powerset. `null` means the form
 * has no specific variant and falls through to the human-form values.
 *
 * Why internalNames not full paths: Utpal's table uses
 * `Kheldian_Pets.<form>.<name>` paths, but those Pets categories aren't
 * in our exported player-power data. The same `<name>` records DO exist
 * as siblings of the human power in the human powerset folder
 * (e.g. `Peacebringer_Offensive.Luminous_Blast.Bright_Nova_Bolt`), with
 * the right damage scale, effect data, and `requires='0'` always-false
 * flag. So at runtime we look the variant up by internalName within the
 * same powerset.
 */
export const KHELDIAN_REDIRECTS: Record<string, KheldianRedirectTargets> = {
  // ============================================
  // PEACEBRINGER — Luminous Blast (offensive)
  // ============================================
  'Gleaming_Bolt': {
    human: 'Gleaming_Bolt',
    nova:  'Bright_Nova_Bolt',
    dwarf: 'White_Dwarf_Bolt',
  },
  'Glinting_Eye': {
    human: 'Glinting_Eye',
    nova:  'Bright_Nova_Glinting_Eye',
    dwarf: 'White_Dwarf_Glinting_Eye',
  },
  'Gleaming_Blast': {
    human: 'Gleaming_Blast',
    nova:  'Bright_Nova_Blast',
    dwarf: null, // falls through to Human
  },
  'Radiant_Strike': {
    human: 'Radiant_Strike',
    nova:  null, // falls through to Human
    dwarf: 'White_Dwarf_Strike',
  },
  'Proton_Scatter': {
    human: 'Proton_Scatter',
    nova:  'Bright_Nova_Scatter',
    dwarf: null,
  },
  'Luminous_Detonation': {
    human: 'Luminous_Detonation',
    nova:  'Bright_Nova_Detonation',
    dwarf: null,
  },
  'Incandescent_Strike': {
    human: 'Incandescent_Strike',
    nova:  null,
    dwarf: 'White_Dwarf_Smite',
  },
  'Solar_Flare': {
    human: 'Solar_Flare',
    nova:  null,
    dwarf: 'White_Dwarf_Flare',
  },

  // ============================================
  // WARSHADE — Umbral Blast (offensive)
  // ============================================
  'Shadow_Bolt': {
    human: 'Shadow_Bolt',
    nova:  'Dark_Nova_Bolt',
    dwarf: 'Black_Dwarf_Bolt',
  },
  'Ebon_Eye': {
    human: 'Ebon_Eye',
    nova:  'Dark_Nova_Ebon_Eye',
    dwarf: 'Black_Dwarf_Eye',
  },
  'Gravimetric_Snare': {
    human: 'Gravimetric_Snare',
    nova:  null, // falls through to Human
    dwarf: 'Black_Dwarf_Strike',
  },
  'Shadow_Blast': {
    human: 'Shadow_Blast',
    nova:  'Dark_Nova_Blast',
    dwarf: null,
  },
  'Sunless_Mire': {
    human: 'Sunless_Mire',
    nova:  'Dark_Nova_Mire',
    dwarf: 'Black_Dwarf_Mire',
  },
  'Dark_Matter_Detonation': {
    human: 'Dark_Matter_Detonation',
    nova:  'Dark_Nova_Detonation',
    dwarf: null,
  },
  'Gravity_Well': {
    human: 'Gravity_Well',
    nova:  null,
    dwarf: 'Black_Dwarf_Smite',
  },
  'Essence_Drain': {
    human: 'Essence_Drain',
    nova:  'Dark_Nova_Essence_Drain',
    dwarf: 'Black_Dwarf_Drain',
  },
  'Gravitic_Emanation': {
    human: 'Gravitic_Emanation',
    nova:  'Dark_Nova_Emanation',
    dwarf: null,
  },
};

/**
 * Resolve the variant internalName that should display for a given base
 * power and active form. Returns the base internalName itself when the
 * form has no specific variant ("falls through to Human") OR when the
 * power isn't a redirect-style power at all (no entry in the table).
 */
export function resolveKheldianRedirect(
  baseInternalName: string,
  form: KheldianForm,
): string {
  const targets = KHELDIAN_REDIRECTS[baseInternalName];
  if (!targets) return baseInternalName;
  if (form === 'human') return targets.human;
  const variant = form === 'nova' ? targets.nova : targets.dwarf;
  return variant ?? targets.human;
}

/**
 * Internal-name set of Kheldian form variants that are reachable only
 * as redirect targets (never user-pickable). Used to filter the power
 * picker so these don't appear as separate slottable picks.
 */
export const KHELDIAN_FORM_VARIANT_NAMES = new Set<string>([
  // Peacebringer - Bright Nova variants
  'Bright_Nova_Bolt', 'Bright_Nova_Blast', 'Bright_Nova_Scatter',
  'Bright_Nova_Detonation', 'Bright_Nova_Glinting_Eye',
  // Peacebringer - White Dwarf variants
  'White_Dwarf_Strike', 'White_Dwarf_Smite', 'White_Dwarf_Flare',
  'White_Dwarf_Sublimation', 'White_Dwarf_Step', 'White_Dwarf_Antagonize',
  'White_Dwarf_Bolt', 'White_Dwarf_Glinting_Eye',
  // Warshade - Dark Nova variants
  'Dark_Nova_Bolt', 'Dark_Nova_Blast', 'Dark_Nova_Emanation',
  'Dark_Nova_Detonation', 'Dark_Nova_Mire', 'Dark_Nova_Ebon_Eye',
  'Dark_Nova_Essence_Drain',
  // Warshade - Black Dwarf variants
  'Black_Dwarf_Strike', 'Black_Dwarf_Smite', 'Black_Dwarf_Drain',
  'Black_Dwarf_Mire', 'Black_Dwarf_Step', 'Black_Dwarf_Antagonize',
  'Black_Dwarf_Bolt', 'Black_Dwarf_Eye',
]);
