/**
 * Global "stance" selectors — the shared descriptor for sets whose powers are
 * gated on a mutually exclusive caster state surfaced in the header.
 *
 * Two sets currently qualify, and they get **identical** UI treatment from one
 * generic header control (`StanceSelector` in Header.tsx) plus the per-power
 * radio in `MechanicAdjusters`:
 *
 *  - **Bio Armor — Adaptation** (Defensive / Offensive / Efficient): a single
 *    toggle cycling `Source.Mode?` stances that gate bonuses on every Bio Armor
 *    power. Drives survivability totals (see `expandActiveConditionals`).
 *  - **Staff Fighting — Form / Perfection** (Body / Mind / Soul): you fight in
 *    one Staff form at a time, building that form's Perfection; at max stacks
 *    the finishers (Sky Splitter, Eye of the Storm) gain form-specific bonuses.
 *    The form *toggles* carry no direct stats — the Perfection-of-<form> gates
 *    are the interaction, so this selector assumes max (Lvl 3) Perfection.
 *
 * Each is keyed by the bare conditional `id`s in the shared `globalAdjusters`
 * map; the header control flips them via `setGlobalAdjusterGroup` so exactly one
 * is active at a time.
 */

import { ADAPTATION_MODES } from './adaptation-modes';

export interface StanceOption {
  /** Conditional id in `globalAdjusters` / generated `conditionalEffects[].id`. */
  id: string;
  /** Full label (tooltip / per-power radio). */
  label: string;
  /** Short label for the header button. */
  short: string;
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
  /**
   * Power internalNames whose presence in the build makes this stance available.
   * The mechanic only exists if the user took the enabling power that grants the
   * stances — Bio Armor's Adaptation toggle (a.k.a. "Evolution"/"Evolving Armor"
   * across ATs) or Staff Fighting's Staff Mastery (see `GRANTED_POWER_GROUPS`).
   * We list the auto-granted stance/form toggles themselves: they're uniformly
   * named across archetypes and present iff the enabling parent was taken. When
   * none are in the build, the header selector is hidden and the dashboard calc
   * skips the mode-gated bonuses (`expandActiveConditionals`).
   */
  requiredPowers: readonly string[];
}

/** Staff Fighting Perfection tracks — the level-3 (max) finisher bonuses. */
export const STAFF_PERFECTION_MODES: readonly StanceOption[] = [
  { id: 'perfection_of_body_level_3', label: 'Perfection of Body', short: 'Body' },
  { id: 'perfection_of_mind_level_3', label: 'Perfection of Mind', short: 'Mind' },
  { id: 'perfection_of_soul_level_3', label: 'Perfection of Soul', short: 'Soul' },
] as const;

export const STANCE_GROUPS: readonly StanceGroup[] = [
  {
    key: 'adaptation',
    headerLabel: 'Adaptation',
    tooltip:
      'Bio Armor stance. Selecting a mode applies its mode-gated bonuses (Defensive +Def/+HP, Offensive +ToHit/-Regen, Efficient +Regen/+Recovery) across every Bio Armor power and the dashboard totals. Mutually exclusive — re-click to clear.',
    activeClass: 'bg-emerald-700/50 border-emerald-500 text-emerald-100',
    options: ADAPTATION_MODES,
    // The three Adaptation stances are auto-granted by the Adaptation /
    // Evolution toggle (see GRANTED_POWER_GROUPS). No Adaptation power → no stance.
    requiredPowers: ['Defensive_Adaptation', 'Efficient_Adaptation', 'Offensive_Adaptation'],
  },
  {
    key: 'staff-form',
    headerLabel: 'Staff Form',
    tooltip:
      'Staff Fighting form. Assumes max (Lvl 3) Perfection of the selected form, applying its finisher bonuses (Body +Smashing/+Res, Mind +Psionic/+ToHit, Soul +Energy/+Regen/+Recovery) to Sky Splitter and Eye of the Storm. Mutually exclusive — re-click to clear.',
    activeClass: 'bg-amber-700/50 border-amber-500 text-amber-100',
    options: STAFF_PERFECTION_MODES,
    // The three Forms are auto-granted by Staff Mastery (see GRANTED_POWER_GROUPS).
    // No Staff Mastery → no form → no Perfection.
    requiredPowers: ['Form_of_the_Body', 'Form_of_the_Mind', 'Form_of_the_Soul'],
  },
] as const;

/** All option ids for a group — pass as the `siblingIds` to `setGlobalAdjusterGroup`. */
export function stanceOptionIds(group: StanceGroup): string[] {
  return group.options.map((o) => o.id);
}

/** The stance group a conditional `id` belongs to, or undefined if the id isn't
 *  a gated stance option. Lets the calc/UI apply the "enabling power required"
 *  gate only to adaptation/perfection conditionals, leaving others untouched. */
export function stanceGroupForConditionalId(id: string): StanceGroup | undefined {
  return STANCE_GROUPS.find((g) => g.options.some((o) => o.id === id));
}

/** True when the build (its selected power internalNames) includes the enabling
 *  power for this stance group — i.e. the mechanic is actually available. */
export function buildHasStanceEnabler(
  group: StanceGroup,
  presentPowerInternalNames: Iterable<string> | ReadonlySet<string>,
): boolean {
  const present = presentPowerInternalNames instanceof Set
    ? presentPowerInternalNames
    : new Set(presentPowerInternalNames);
  return group.requiredPowers.some((n) => present.has(n));
}
