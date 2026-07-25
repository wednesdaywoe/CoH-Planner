/**
 * The **effective power** — which power a display surface is actually showing (PROD6C-3k).
 *
 * `buildDisplayEffects` and the bag transforms beside it are pure functions of one power
 * object. This resolves WHICH power that object is, from the build's combat state:
 *
 * 1. **quick snipe** — in combat, a snipe shows its fast cast/range and the quick form's damage.
 * 2. **mid-combat cast** — an opener with a separate `midCombatCast` uses it when NOT hidden;
 *    the slow interruptible animation is the from-Hide one.
 * 3. **active conditionals** — the mode-gated contributions whose toggle is on merge onto
 *    `effects` and `damage`, with the additive collisions returned as `extraInstances`.
 *
 * Extracted from `InfoPanel`'s three memos so the panel, the picker tooltip, and the engine
 * gate all resolve the same power. The Kheldian / Primalist form redirect stays in `InfoPanel`:
 * its variant data is beta-only and the engine cannot address it, so it is applied to the power
 * BEFORE this is called rather than inside it.
 *
 * The engine mirrors every rule here in `coh_math/src/effective.rs`; the projection's values
 * describe this power, keyed to the base power's identity.
 */

import { applyQuickSnipe } from '@/utils/quick-snipe';
import { selectActiveConditionals, type ATInherentState } from '@/utils/conditional-effects';
import { applyActiveConditionals, type ApplyConditionalsResult } from './powerDisplayUtils';
import { stanceAdjusterOverrides } from '@/data';
import type { Power } from '@/types/power';
import type { Build } from '@/types/build';

/** The build/UI state the resolution reads. */
export interface EffectivePowerState {
  /** Sustained-combat mode — the quick-snipe gate. */
  combatMode: boolean;
  /** The caster is hidden (Stalker from-Hide opener state) — suppresses the mid-combat cast. */
  hidden: boolean;
  /** `scope: 'global'` toggles by conditional id, already carrying the build's stance overrides
   *  (see `effectiveGlobalAdjusters`). */
  globalAdjusters: Record<string, boolean>;
  /** `scope: 'per-power'` toggles, keyed `<internalName>:<id>`. */
  mechanicAdjusters: Record<string, boolean>;
  /** AT-inherent mechanics the Header owns rather than the toggle maps. */
  atInherentState?: ATInherentState;
}

/**
 * The global toggle map with the build's stance state overlaid — the selected Bio Armor
 * adaptation / Staff form is build-scoped (`activeSubPower`), so it wins over a stale UI toggle,
 * exactly as the dashboard calc overlays it. Every surface that resolves an effective power reads
 * the map through here so the three cannot drift.
 */
export function effectiveGlobalAdjusters(
  build: Build,
  globalAdjusters: Record<string, boolean>,
): Record<string, boolean> {
  const stancePowers: { internalName: string; activeSubPower?: string }[] = [];
  const addStance = (powers?: { internalName: string; activeSubPower?: string }[]) =>
    powers?.forEach((p) => stancePowers.push({ internalName: p.internalName, activeSubPower: p.activeSubPower }));
  addStance(build.primary?.powers);
  addStance(build.secondary?.powers);
  build.pools?.forEach((pool) => addStance(pool.powers));
  addStance(build.epicPool?.powers);
  return { ...globalAdjusters, ...stanceAdjusterOverrides(stancePowers) };
}

/**
 * Whether the caster is actually hidden. The alpha-strike scenario needs the Hide power in the
 * build — without it `stalkerHidden` would model an impossible state — so the toggle alone is not
 * the answer. Single-sourced here because three surfaces and the engine adapter all need it.
 */
export function isCasterHidden(build: Build, stalkerHidden: boolean): boolean {
  return stalkerHidden && build.secondary.powers.some((p) => p.internalName === 'Hide');
}

export function resolveEffectivePower(power: Power, state: EffectivePowerState): ApplyConditionalsResult {
  const sniped = applyQuickSnipe(power, state.combatMode);
  // Assassin's Strike fires its slow interruptible animation from Hide (the displayed base cast)
  // but a much faster Quick animation mid-combat. Mirror the from-Hide toggle that already drives
  // its damage so the cast time matches the state: not hidden → the fast uninterruptible cast.
  const cast =
    sniped.midCombatCast == null || state.hidden
      ? sniped
      : { ...sniped, stats: { ...sniped.stats, castTime: sniped.midCombatCast, interruptTime: undefined, timeToRoot: undefined } };
  const active = selectActiveConditionals(
    cast,
    state.mechanicAdjusters,
    state.globalAdjusters,
    state.atInherentState ?? {},
  );
  if (active.length === 0) return { power: cast, extraInstances: {} };
  return applyActiveConditionals(cast, active);
}
