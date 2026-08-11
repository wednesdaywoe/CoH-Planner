/**
 * Perma tracker calculations
 *
 * A power is "perma" when its effective recharge time is equal to or less than
 * its duration, meaning it can be reactivated immediately when it expires.
 *
 * "Its duration" is the CASTER-SIDE window (`selfStateWindow`), not the bag's
 * `buffDuration` — see that function for why the two are different questions.
 *
 * Formula:
 *   duration       = the longest caster-side state's own duration
 *   rechargeNeeded = (baseRecharge / duration) - 1  (total +rech% required for perma)
 *   totalRecharge  = slottedRecharge + globalRecharge (combined from slotting + set bonuses)
 *   netStrength    = clamp(1 + totalRecharge, bounds.floor, bounds.cap)
 *   permaPercent   = (netStrength - 1) / rechargeNeeded * 100  (0% = no bonuses, 100% = perma)
 *   effectiveRecharge = baseRecharge / netStrength
 */

import type { SelectedPower, Power, PowerEffects } from '@/types';
import { hasSelfDirectedPenalty } from '@/types';
import { atomsOf } from '@/data/core/atom-query';
import type { EnhancementBonuses } from './enhancement-values';

/**
 * The archetype's RechargeTime `ClampStrength` interval — the bounds the server
 * holds NET recharge strength to (floor 0.25 = the −75% debuff floor, cap 5.0 =
 * +400%). Sourced per class from the export via `AT_TABLES[...].rechargeBounds`.
 *
 * Unlike most reduction clamps this one is genuinely REACHABLE, so it has to be
 * honoured twice over: recharge past the cap must stop buying a faster cycle,
 * and a power whose cycle still can't fit its window at the cap can never be
 * permaed at all. `undefined` leaves both tests out rather than inventing a
 * ceiling — absence is not a number (Rule 1).
 */
export interface RechargeBounds {
  floor: number;
  cap: number;
}

/**
 * How re-firing the power while its caster-side window is still running combines
 * with the copy already up — "does casting early double the buff, or just restart
 * the clock". Read off the atoms' authored stacking flavour, never inferred from
 * durations.
 */
export type RecastBehavior = 'refreshes' | 'stacks';

/**
 * The recast verdict for the caster-side window at `seconds`: every atom that
 * times that window and lands on the caster is classified by its authored
 * stacking flavour, and only a unanimous family yields a verdict. A mix — or a
 * flavour whose recast semantics this repo has not proven (`Extend` lengthens,
 * `Overlap`/`Maximize`/`Ignore`/`Suppress`/`StackThenIgnore`/`Continuous` each
 * mean something else) — yields `undefined`: a single badge would misdescribe at
 * least one row, and an absent verdict is "unstated", never a claim.
 *
 * The duration join and the caster filter are `casterHoldsStateAt`'s, for the
 * same reason it needs them: the bag's slots carry no target, so the atoms are
 * the only place the export records *whose* clock the flavour governs.
 */
export function recastVerdict(power: Power | SelectedPower, seconds: number): RecastBehavior | undefined {
  const foeTargeting = targetsAFoe(power);
  let refreshes = false;
  let stacks = false;
  for (const atom of atomsOf(power)) {
    if (!atom.duration) continue;
    if (Math.abs(atom.duration - seconds) > DURATION_MATCH_TOLERANCE) continue;
    if (!landsOnCaster(atom, foeTargeting)) continue;
    switch (atom.stacking) {
      case 'Replace':
      case 'Refresh':
        refreshes = true;
        break;
      // The converter's own self-stacking rule (`detectSelfStacking`): these two
      // accumulate only with room above one copy. A capped-at-one or cap-less
      // read is unproven, so it refuses a verdict rather than guessing.
      case 'Stack':
      case 'RefreshToCount':
        if ((atom.stackCap ?? 0) > 1) {
          stacks = true;
          break;
        }
        return undefined;
      case 'Extend':
      case 'Overlap':
      case 'Maximize':
      case 'Ignore':
      case 'Suppress':
      case 'StackThenIgnore':
      case 'Continuous':
      case 'Yes':
      case 'No':
        return undefined;
    }
  }
  if (refreshes && !stacks) return 'refreshes';
  if (stacks && !refreshes) return 'stacks';
  // No atom timed the window, or the families disagree across rows.
  return undefined;
}

export interface PermaInfo {
  /** Base recharge time in seconds */
  baseRecharge: number;
  /** Power duration in seconds */
  duration: number;
  /** Effective recharge after enhancements and global bonuses */
  effectiveRecharge: number;
  /** Total +recharge% needed to reach perma (as decimal, e.g. 2.75 = 275%) */
  rechargeNeeded: number;
  /** Current total +recharge% (slotted + global, as decimal) */
  totalRecharge: number;
  /** Percentage (0-100, capped at 100) — progress toward required recharge */
  permaPercent: number;
  /** True when the power can be kept up permanently */
  isPerma: boolean;
  /**
   * Whether recasting inside the window stacks or merely refreshes
   * (`recastVerdict` at this window's duration); absent when the atoms don't
   * state a single answer.
   */
  recast?: RecastBehavior;
}

/**
 * Check if a power is eligible for perma tracking.
 *
 * A power is perma-eligible when keeping it active permanently is meaningful:
 * - Must be a Click power. Toggles re-apply on a tick cadence (their
 *   `buffDuration` is per-tick refresh, e.g. 0.75s, not a window between
 *   activations) and Auto powers fire automatically — neither has a perma
 *   gap to close. Charged Armor and other defense toggles were
 *   incorrectly tracked because both have recharge + per-tick duration.
 * - Must have a positive recharge AND a caster-side window to keep up — one and
 *   the same test, since `selfStateWindow` is 0 exactly when the power leaves no
 *   such state. Foe debuffs and mez don't count: those expire on the target, and
 *   the planner doesn't model refreshing them by re-firing on cadence.
 * - Perma must be REACHABLE: the cycle at the archetype's maximum recharge
 *   strength still has to fit inside the window (`recharge / bounds.cap <=
 *   duration`). This is the same comparison `calculatePermaInfo` makes for
 *   `isPerma`, evaluated at the ceiling, so eligibility and the ring can no
 *   longer disagree about what is possible.
 * - For powers that deal damage (attacks): require recharge >= 2× duration, since
 *   the duration is typically a hold/mez that roughly matches recharge (Dark Grasp).
 *   This still includes buff-attacks like Soul Drain (120s rech / 30s dur).
 * - For non-damage powers (buffs, summons): require recharge > duration, a looser
 *   threshold that includes Lightning Storm (90s rech / 60s dur).
 *
 * This replaced a `PRACTICAL_RECHARGE_CAP = 5` threshold that was wrong twice:
 * the exported ceiling is a net STRENGTH of 5.0 (i.e. +400%, not the "+500%
 * global recharge cap" its comment claimed), and it was compared against
 * `recharge/duration - 1`, so the gate actually admitted every ratio up to and
 * including 6.0. The band between was powers whose ring the planner drew and the
 * arithmetic could never fill — a large cluster sitting at exactly ratio 6.00
 * (Placate 60/10, Zapp 24/4, Wormhole and Category Five 90/15).
 */
export function isPermaEligible(
  power: Power | SelectedPower,
  bounds?: RechargeBounds,
): boolean {
  const effects = power.effects;
  if (!effects) return false;

  if (power.powerType === 'Toggle' || power.powerType === 'Auto') return false;

  const recharge = getRecharge(effects, power);
  const duration = selfStateWindow(power, effects);
  if (recharge <= 0 || duration <= 0) return false;

  if (bounds && recharge / bounds.cap > duration) return false;

  const hasDamage = !!(power as Power).damage;
  return hasDamage ? recharge >= duration * 2 : recharge > duration;
}

/**
 * Effect-bag keys a CASTER-side buff can occupy. Presence alone does not make one
 * the caster's: the converter's buff branches emit `{scale, table}` and stamp
 * `toWho` only on the self-penalty branches, so not one of these slots carries a
 * target, and `Math.abs` has already dropped the sign. A foe-directed effect
 * lands in them too — Sonic Melee's `debuffResistance` is `Target kTarget` in the
 * authored def, reducing the FOE's resistance to debuffs, and a foe slow lands in
 * `movement`.
 *
 * The export is not missing the answer, only this projection of it: the atom
 * array carries `toWho` on every atom, and `casterHoldsStateAt` joins back to it
 * on the duration.
 */
const SELF_BUFF_KEYS = [
  'tohitBuff', 'damageBuff', 'defenseBuff', 'defenseBuffSuppressible', 'rechargeBuff',
  'recoveryBuff', 'regenBuff', 'regenBuffUnenhanced', 'speedBuff', 'enduranceBuff',
  'enduranceGain', 'maxHPBuff', 'maxEndBuff', 'rangeBuff', 'enduranceDiscount',
  'perceptionBuff', 'specialBuff', 'absorb', 'defense', 'resistance', 'elusivity', 'movement', 'stealth',
  'debuffResistance', 'mezResistance', 'protection', 'untouchable', 'fly',
] as const;

/**
 * Debuff slots the converter's self-penalty branches tag, and so the only ones
 * that can carry a penalty the CASTER takes. Each still has to prove it with
 * `toWho: 'Self'` — the same slot on another power is an ordinary foe debuff.
 */
const SELF_PENALTY_KEYS = ['damageDebuff', 'rechargeDebuff', 'tohitDebuff', 'accuracyDebuff'] as const;

/** The bag rounds its duration out of the same source string the atom parses, so the two agree
 *  exactly today; the tolerance degrades a future rounding change into a missed veto rather
 *  than a wrong window. */
const DURATION_MATCH_TOLERANCE = 1e-3;

/**
 * Whether the power is aimed at an enemy, over the export's own `targetType`
 * vocabulary. This gates the whole veto, because `toWho: 'Target'` means
 * "whoever this power is aimed at" and NOT "an enemy": on a team buff the target
 * is a teammate and the caster is normally among them. Reading that value as
 * foe-directed silently deletes the ring from the archetypal perma powers —
 * Accelerate Metabolism, Chrono Shift and Farsight all carry `targetType: 'Self'`
 * with atoms aimed at `Target`.
 */
function targetsAFoe(power: Power | SelectedPower): boolean {
  return power.targetType?.startsWith('Foe') ?? false;
}

/**
 * Whether an atom's effect reaches the caster. The two signals carry different
 * weight: `notOnCaster` is explicit and decides on its own, while `toWho:
 * 'Target'` excludes the caster only when the target is an enemy. An absent or
 * `Unspecified` target proves nothing and reads as "reaches the caster", so
 * missing evidence can never manufacture a veto.
 */
function landsOnCaster(atom: { toWho?: string; notOnCaster?: boolean }, foeTargeting: boolean): boolean {
  if (atom.notOnCaster === true) return false;
  return atom.toWho === 'Target' ? !foeTargeting : true;
}

/**
 * Does the caster hold anything for `seconds`? `false` only when the power's
 * atoms positively account for that duration and every one of them lands on the
 * target; `undefined` when no atom carries it — the "no evidence" case, which is
 * not a negative answer.
 *
 * This is the target check the bag cannot answer for `SELF_BUFF_KEYS`: those
 * slots ship no `toWho`, but the atoms do, so the duration is the join key back
 * to them. A power whose self buff and foe debuff happen to share a duration
 * passes the veto — this can fail to remove a foe window, never remove a
 * caster's own.
 */
function casterHoldsStateAt(power: Power | SelectedPower, seconds: number): boolean | undefined {
  const foeTargeting = targetsAFoe(power);
  let accounted = false;
  let caster = false;
  for (const atom of atomsOf(power)) {
    if (!atom.duration) continue;
    if (Math.abs(atom.duration - seconds) > DURATION_MATCH_TOLERANCE) continue;
    accounted = true;
    caster = caster || landsOnCaster(atom, foeTargeting);
  }
  return accounted ? caster : undefined;
}

/**
 * Whether `key`'s entry in `durations` times a state the CASTER keeps up — the
 * same routes `selfStateWindow` walks, asked one key at a time. `seconds` is that
 * entry's own value, which the `SELF_BUFF_KEYS` route needs to reach the atoms.
 */
function timesACasterState(
  power: Power | SelectedPower,
  effects: PowerEffects,
  key: string,
  seconds: number,
): boolean {
  const bag = effects as unknown as Record<string, unknown>;
  // The converter can record an absorb as a duration and nothing else (Wild
  // Bastion's magnitude arrives via an Expression template), so this key does not
  // require its own bag slot.
  if (key === 'absorb') return casterHoldsStateAt(power, seconds) ?? true;
  if ((SELF_BUFF_KEYS as readonly string[]).includes(key)) {
    return bag[key] !== undefined && (casterHoldsStateAt(power, seconds) ?? true);
  }
  if ((SELF_PENALTY_KEYS as readonly string[]).includes(key)) {
    return isSelfDirectedSlot(bag[key]);
  }
  return key === 'slow'
    && typeof effects.slow === 'object' && effects.slow !== null
    && Object.values(effects.slow as Record<string, unknown>).some(isSelfDirectedSlot);
}

/** A debuff the CASTER suffers: the object-shaped `{scale, table}` carrying `toWho: 'Self'`.
 *  A bare-number debuff slot is foe/display-only by construction. */
function isSelfDirectedSlot(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return 'scale' in obj && 'table' in obj && obj.toWho === 'Self';
}

/**
 * The caster-side window in seconds — the longest-lived state the caster is
 * keeping up, and 0 when the power leaves none. Every route that can qualify a
 * power names its own duration: a summon its lifetime, a self buff /
 * self-directed penalty / absorb its own entry in `durations`.
 *
 * Deliberately NOT the bag's `buffDuration`. `convert-powerset.cjs` derives that
 * field as a plurality vote over every entry in `durations`, foe effects
 * included, so on a power that debuffs its target it reports the DEBUFF's
 * lifetime: Melt Armor read 40s (the −Resistance on the foe) against the 9s self
 * +Damage the caster actually holds, Thunderspy Hide read 20s (the foe's −ToHit)
 * against a 10s stealth, and Ki Push read the target's 2s hold against an 8.33s
 * self buff. It is a fine display default for "how long does this row last",
 * which is what the info panel uses it for, but the perma ring asks a different
 * question and was never entitled to that answer. Measured across the three
 * forks, 21 / 20 / 24 then-eligible powers had a window matching NO self-side
 * effect at all.
 *
 * The longest window wins when several qualify — perma tracking is about the
 * state that has to survive the recharge gap, and a shorter buff riding along
 * re-applies with the power either way.
 *
 * A present `durations` map is authoritative, because the converter writes one
 * entry per timed effect: a self key missing from it is instantaneous, not
 * undated (the endurance an Electric Blast attack returns). Only an ABSENT map
 * lets the power-level `buffDuration` stand in, which is what keeps Rest — a real
 * +Recovery/+Regen click whose per-effect durations the export never recorded —
 * from losing its ring.
 *
 * Both arms take the bag's answer and let the atoms veto it, never the reverse:
 * the bag names WHICH state, the atom array is the only place the export records
 * WHOSE it is.
 */
function selfStateWindow(power: Power | SelectedPower, effects: PowerEffects): number {
  const summonLifetime = effects.summon?.duration && effects.summon.duration > 0
    ? effects.summon.duration
    : 0;

  const perEffect = effects.durations;
  if (!perEffect || Object.keys(perEffect).length === 0) {
    if (!hasCasterState(power, effects)) return summonLifetime;
    const powerLevel = typeof effects.buffDuration === 'number' && effects.buffDuration > 0
      ? effects.buffDuration
      : 0;
    return Math.max(summonLifetime, powerLevel);
  }

  let window = summonLifetime;
  for (const [key, seconds] of Object.entries(perEffect)) {
    if (typeof seconds !== 'number' || seconds <= 0) continue;
    if (!timesACasterState(power, effects, key, seconds)) continue;
    window = Math.max(window, seconds);
  }
  return window;
}

/**
 * The power lands SOMETHING on the caster. Only used to decide whether the
 * power-level `buffDuration` may stand in as the window, so it deliberately asks
 * nothing about durations. The atoms get the same veto they get on the per-effect
 * arm, minus the duration join, since this arm runs precisely when there is no
 * per-effect duration to join on: a power whose every atom is aimed at the target
 * holds nothing, however self-shaped its bag slots look.
 */
function hasCasterState(power: Power | SelectedPower, effects: PowerEffects): boolean {
  if (!hasSelfStateSlot(effects)) return false;
  const atoms = atomsOf(power);
  const foeTargeting = targetsAFoe(power);
  return atoms.length === 0 || atoms.some((atom) => landsOnCaster(atom, foeTargeting));
}

/**
 * True when the power occupies a self-buff slot or carries a self-directed
 * penalty — the bag-shaped half of the question, with no target check.
 */
function hasSelfStateSlot(effects: PowerEffects): boolean {
  const bag = effects as unknown as Record<string, unknown>;
  if (SELF_BUFF_KEYS.some((key) => bag[key] !== undefined)) return true;

  // Self-penalty powers (Granite Armor's -damage, Defensive Adaptation's
  // -recharge) carry a caster-side downside — a self-state whose uptime is
  // worth perma-tracking. Detected per-effect via `toWho:'Self'`.
  return hasSelfDirectedPenalty(effects);
  // NB the absorb-duration route lives in `timesACasterState`, on the per-effect
  // arm where `durations.absorb` actually exists. This function only runs when
  // that map is absent entirely, so testing it here could never fire.
}

/**
 * Calculate perma info for a power.
 *
 * @param power - The power definition
 * @param enhBonuses - Enhancement bonuses for the power (from calculatePowerEnhancementBonuses)
 * @param globalRecharge - Global recharge bonus as a decimal (e.g., 0.7 for 70%)
 */
export function calculatePermaInfo(
  power: Power | SelectedPower,
  enhBonuses: EnhancementBonuses,
  globalRecharge: number,
  bounds?: RechargeBounds,
): PermaInfo | null {
  const effects = power.effects;
  if (!effects) return null;

  // Toggles and autos don't have a perma cycle (see isPermaEligible).
  if (power.powerType === 'Toggle' || power.powerType === 'Auto') return null;

  const baseRecharge = getRecharge(effects, power);
  const duration = selfStateWindow(power, effects);
  if (baseRecharge <= 0 || duration <= 0) return null;

  // StrengthsDisallowed('RechargeTime'): the game applies NO recharge strength
  // to this power — Hasten, set bonuses, and slotted IOs are all ignored (Rune
  // of Protection, the armor T9s, some MM summons). GlobalStrengthsDisallowed
  // keeps slotted enhancement but ignores globals (Kuji-In Rin). Server-side
  // .powers data, HC only; see Power.strengthsDisallowed.
  const rechargeLocked = power.strengthsDisallowed?.includes('RechargeTime') ?? false;
  const globalLocked = rechargeLocked
    || (power.globalStrengthsDisallowed?.includes('RechargeTime') ?? false);
  const slottedRecharge = rechargeLocked ? 0 : (enhBonuses.recharge ?? 0);
  const totalRecharge = slottedRecharge + (globalLocked ? 0 : globalRecharge);

  // Both numbers below read the CLAMPED net strength, because the game has only
  // the clamped one. `totalRecharge` stays raw for display — it is what the build
  // actually carries — but a build past the +400% cap does not cycle faster and
  // does not get any closer to perma either. Without bounds there is no ceiling to
  // measure against, so it stands aside rather than inventing one; the old
  // `Math.max(1, …)` floor is subsumed by the real exported floor.
  const netStrength = bounds
    ? Math.min(Math.max(1 + totalRecharge, bounds.floor), bounds.cap)
    : Math.max(1, 1 + totalRecharge);
  const effectiveRecharge = baseRecharge / netStrength;
  const rechargeNeeded = (baseRecharge / duration) - 1; // e.g. 450/120 - 1 = 2.75
  const permaPercent = rechargeNeeded > 0
    ? Math.min(100, ((netStrength - 1) / rechargeNeeded) * 100)
    : 100;

  return {
    baseRecharge,
    duration,
    effectiveRecharge,
    rechargeNeeded,
    totalRecharge,
    permaPercent,
    isPerma: effectiveRecharge <= duration,
    recast: recastVerdict(power, duration),
  };
}

/** Extract recharge time from effects, falling back to power.stats */
function getRecharge(effects: PowerEffects, power: Power | SelectedPower): number {
  if (typeof effects.recharge === 'number' && effects.recharge > 0) return effects.recharge;
  if (power.stats?.recharge && power.stats.recharge > 0) return power.stats.recharge;
  return 0;
}

