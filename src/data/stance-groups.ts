/**
 * Global "stance" selectors — sets whose powers are gated on a mutually
 * exclusive caster stance.
 *
 * Single source of truth: the stance lives in the **parent power's
 * `activeSubPower`** (build-scoped, serialized, the same field Dual Pistols ammo
 * uses). Taking the parent (Bio Armor's Adaptation / "Evolution", Staff
 * Fighting's Staff Mastery) auto-grants the stance/form sub-powers as chips, and
 * selecting one sets `parent.activeSubPower`. Every consumer derives the active
 * stance from that field:
 *   - the dashboard calc (`expandActiveConditionals` via `stanceAdjusterOverrides`),
 *   - the InfoPanel conditional merge, and
 *   - the header + per-power stance selectors (which write it back via
 *     `setActiveSubPower`).
 *
 * The mode-gated `conditionalEffects` on each power are keyed by the bare
 * conditional `id` (e.g. `defensiveadaptation`, `perfection_of_body_level_3`);
 * `subPower` maps each option to the `activeSubPower` value that selects it.
 *
 *  - **Bio Armor — Adaptation** (Defensive / Offensive / Efficient): drives
 *    survivability totals. Note the data id for the Efficient stance is the
 *    legacy "rested"; the sub-power and label use the in-game "Efficient".
 *  - **Staff Fighting — Form / Perfection** (Body / Mind / Soul): the form chip
 *    sets the stance; selecting it assumes max (Lvl 3) Perfection of that form,
 *    applying the finisher bonuses on Sky Splitter / Eye of the Storm.
 */

export interface StanceOption {
  /** Conditional id in the generated `conditionalEffects[].id`. */
  id: string;
  /** Full label (tooltip / per-power radio). */
  label: string;
  /** Short label for the header button. */
  short: string;
  /** The parent's `activeSubPower` value that selects this stance — the
   *  auto-granted sub-power's internalName (see `GRANTED_POWER_GROUPS`). */
  subPower: string;
}

export interface StanceGroup {
  /** Unique key (React key + radio group name). */
  key: string;
  /** Header chip label, e.g. "Adaptation" / "Staff Form". */
  headerLabel: string;
  /** Tooltip describing the control. */
  tooltip: string;
  /** Tailwind classes for the active (selected) button. */
  activeClass: string;
  /** The mutually exclusive options (one active at a time). */
  options: readonly StanceOption[];
  /** Parent power internalName(s) that grant this stance — the form-switcher.
   *  Bio Armor is "Adaptation" on Stalker/Sentinel and "Evolution" on
   *  Scrapper/Brute/Tanker; Staff Fighting is "Staff Mastery". The stance is
   *  available iff one of these is in the build, and selecting a stance writes
   *  that parent's `activeSubPower`. */
  parents: readonly string[];
}

export const STANCE_GROUPS: readonly StanceGroup[] = [
  {
    key: 'adaptation',
    headerLabel: 'Adaptation',
    tooltip:
      'Bio Armor stance. Selecting a mode applies its mode-gated bonuses (Defensive +Def/+HP, Offensive +ToHit/-Regen, Efficient +Regen/+Recovery) across every Bio Armor power and the dashboard totals. Mutually exclusive — re-click to clear.',
    activeClass: 'bg-emerald-700/50 border-emerald-500 text-emerald-100',
    parents: ['Adaptation', 'Evolution'],
    options: [
      { id: 'defensiveadaptation', label: 'Defensive Adaptation', short: 'Defensive', subPower: 'Defensive_Adaptation' },
      { id: 'offensiveadaptation', label: 'Offensive Adaptation', short: 'Offensive', subPower: 'Offensive_Adaptation' },
      { id: 'restedadaptation', label: 'Efficient Adaptation', short: 'Efficient', subPower: 'Efficient_Adaptation' },
    ],
  },
  {
    key: 'staff-form',
    headerLabel: 'Staff Form',
    tooltip:
      'Staff Fighting form. Assumes max (Lvl 3) Perfection of the selected form, applying its finisher bonuses (Body +Smashing/+Res, Mind +Psionic/+ToHit, Soul +Energy/+Regen/+Recovery) to Sky Splitter and Eye of the Storm. Mutually exclusive — re-click to clear.',
    activeClass: 'bg-amber-700/50 border-amber-500 text-amber-100',
    parents: ['Staff_Mastery'],
    options: [
      { id: 'perfection_of_body_level_3', label: 'Perfection of Body', short: 'Body', subPower: 'Form_of_the_Body' },
      { id: 'perfection_of_mind_level_3', label: 'Perfection of Mind', short: 'Mind', subPower: 'Form_of_the_Mind' },
      { id: 'perfection_of_soul_level_3', label: 'Perfection of Soul', short: 'Soul', subPower: 'Form_of_the_Soul' },
    ],
  },
] as const;

/** Minimal shape the derive/lookup helpers need from a build power. */
export interface StancePowerLike {
  internalName: string;
  activeSubPower?: string;
}

/** The stance group a conditional `id` belongs to, or undefined if the id isn't
 *  a gated stance option. Lets consumers treat stance conditionals specially. */
export function stanceGroupForConditionalId(id: string): StanceGroup | undefined {
  return STANCE_GROUPS.find((g) => g.options.some((o) => o.id === id));
}

/** The group's enabling parent power present in `powers`, or undefined. The
 *  stance is only available — and only settable — when this exists. */
export function findStanceParent(
  powers: readonly StancePowerLike[],
  group: StanceGroup,
): StancePowerLike | undefined {
  return powers.find((p) => group.parents.includes(p.internalName));
}

/** The active option id for a group given the build's powers (read from the
 *  parent's `activeSubPower`), or null when no stance is selected. */
export function activeStanceOptionId(
  powers: readonly StancePowerLike[],
  group: StanceGroup,
): string | null {
  const parent = findStanceParent(powers, group);
  if (!parent?.activeSubPower) return null;
  return group.options.find((o) => o.subPower === parent.activeSubPower)?.id ?? null;
}

/**
 * Derive the effective on/off state of EVERY stance conditional id from the
 * build's `activeSubPower` selections. Inactive options are set explicitly to
 * `false` so callers can overlay this onto the UI `globalAdjusters` map and have
 * `activeSubPower` win (overriding any stale global toggle). The result is what
 * the calc / InfoPanel merge consult for stance conditionals.
 */
export function stanceAdjusterOverrides(
  powers: readonly StancePowerLike[],
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const group of STANCE_GROUPS) {
    const activeId = activeStanceOptionId(powers, group);
    for (const o of group.options) out[o.id] = o.id === activeId;
  }
  return out;
}
