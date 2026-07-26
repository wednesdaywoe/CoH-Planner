/**
 * The **effective power** — which power a display surface is actually showing (PROD6C-3k).
 *
 * `buildDisplayEffects` and the bag transforms beside it are pure functions of one power
 * object. This resolves WHICH power that object is, from the build's combat state:
 *
 * 1. **mode redirect** — while a caster mode is live, the game's PowerRedirector fires a
 *    different record entirely (a Kheldian attack in Nova form, a Titan Weapons attack under
 *    Momentum). The converter carries the whole table as `power.modeVariants`.
 * 2. **quick snipe** — in combat, a snipe shows its fast cast/range and the quick form's damage.
 * 3. **mid-combat cast** — an opener with a separate `midCombatCast` uses it when NOT hidden;
 *    the slow interruptible animation is the from-Hide one.
 * 4. **active conditionals** — the mode-gated contributions whose toggle is on merge onto
 *    `effects` and `damage`, with the additive collisions returned as `extraInstances`.
 *
 * Extracted from `InfoPanel`'s memos so the panel, the picker tooltip, and the engine gate all
 * resolve the same power.
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
  /** Caster modes the player has switched on (Kheldian/Primalist forms, Momentum, Seismic
   *  Power) — the `power.modeVariants` keys. Absent means no mode is live. */
  activeModes?: readonly string[];
}

/**
 * The variant the game redirects to while one of `activeModes` is live, or the power itself.
 *
 * The base keeps its identity — slots, enhancements and picker entry live there and every mode
 * shares them — so only what the power DOES is replaced. When more than one live mode has a
 * variant, the power's own table order decides, which is the order the binary lists the
 * redirects in.
 */
function applyModeRedirect(power: Power, activeModes: readonly string[] | undefined): Power {
  if (!power.modeVariants || !activeModes?.length) return power;
  const mode = Object.keys(power.modeVariants).find((m) => activeModes.includes(m));
  if (mode === undefined) return power;
  return { ...power, ...power.modeVariants[mode] };
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
  const sniped = applyQuickSnipe(applyModeRedirect(power, state.activeModes), state.combatMode);
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
