/**
 * Attack Chain Builder — data wiring.
 *
 * Derives `ChainPower[]` and the character endurance parameters from the LIVE
 * build, reusing the same calc functions the power tooltips use so the chain's
 * numbers match the rest of the app. Pure scheduling/endurance math lives in
 * `attack-chain.ts`; this layer is the only part that touches build/data.
 */

import type { Build, SelectedPower, PowerEffects } from '@/types';
import { getIOSet, arcToDegrees } from '@/data';
import { getTableValue } from '@/data/at-tables';
import {
  calculatePowerEnhancementBonuses,
  calculatePowerDamage,
  calculateArcanaTime,
  calculateCharacterTotals,
} from '@/utils/calculations';
import { calcThreeTier, convertGlobalBonusesToAspects } from '@/components/info/powerDisplayUtils';
import { calculateSlottedProcDamagePerCast } from './power-proc-damage';
import { atMechanicMultiplier, type AtMechanicContext } from './power-at-mechanics';
import type { ChainPower, ChainPowerType, EnduranceParams } from './attack-chain';

type CalcResult = ReturnType<typeof calculateCharacterTotals>;
type GlobalBonuses = CalcResult['globalBonuses'];

interface Candidate {
  power: SelectedPower;
  powersetName: string;
  /** Powerset id (e.g. "scrapper/dark-melee") — gates the AT crit mechanic. */
  powersetId: string;
  category?: 'PRIMARY' | 'SECONDARY';
  /** stable bucket prefix so ids don't collide across sets/pools. */
  bucket: string;
}

// Base timing/cost reads that handle the data-shape split: primary/secondary
// powers carry these under `stats`, but pool / epic / patron powers (built by
// power-pools.ts / epic-pools.ts, which rename activationTime → castTime) carry
// them under `effects` with no `stats` block. Read `stats` first, then `effects`.
const powerCastTime = (p: SelectedPower): number => p.stats?.castTime ?? p.effects?.castTime ?? 0;
const powerBaseRecharge = (p: SelectedPower): number => p.stats?.recharge ?? p.effects?.recharge ?? 0;
const powerEndCost = (p: SelectedPower): number => p.stats?.endurance ?? p.effects?.enduranceCost ?? 0;
const powerRadius = (p: SelectedPower): number => p.stats?.radius ?? p.effects?.radius ?? 0;
const powerArc = (p: SelectedPower): number | undefined => p.stats?.arc ?? p.effects?.arc;

/** Click powers (attacks, click buffs, click controls) from every powerset.
 *  Toggles/autos/passives can't sit in an attack chain, so they're excluded. */
function collectCandidates(build: Build): Candidate[] {
  const out: Candidate[] = [];
  const add = (
    powers: SelectedPower[] | undefined,
    powersetName: string,
    powersetId: string,
    bucket: string,
    category?: 'PRIMARY' | 'SECONDARY',
  ) => {
    powers?.forEach((p) => {
      if (p.powerType !== 'Click') return;
      if (p.isAutoGranted) return;
      // Needs a cast time from EITHER shape (stats or effects) to sit in a chain.
      if (p.stats?.castTime == null && p.effects?.castTime == null) return;
      out.push({ power: p, powersetName, powersetId, category, bucket });
    });
  };
  add(build.primary?.powers, build.primary?.name ?? 'Primary', build.primary?.id ?? '', 'pri', 'PRIMARY');
  add(build.secondary?.powers, build.secondary?.name ?? 'Secondary', build.secondary?.id ?? '', 'sec', 'SECONDARY');
  build.pools?.forEach((pool, i) => add(pool.powers, pool.name ?? 'Pool', pool.id ?? '', `pool${i}`));
  add(build.epicPool?.powers, build.epicPool?.name ?? 'Epic', build.epicPool?.id ?? '', 'epic');
  return out;
}

/** Resolve an effect's duration (s) from the per-effect `durations` map: try
 *  each key in priority order (exact, then any duration key whose base — before
 *  a `_suffix` like the strength meta-template discriminator — matches), then
 *  the supplied power-level fallbacks. 0 when nothing positive is found. Shared
 *  by the self-buff and foe-debuff window helpers so they resolve identically. */
function resolveEffectDuration(
  e: PowerEffects,
  keys: readonly string[],
  fallbacks: ReadonlyArray<number | undefined>,
): number {
  const durs = e.durations;
  if (durs) {
    for (const k of keys) {
      const exact = durs[k];
      if (typeof exact === 'number' && exact > 0) return exact;
      for (const dk of Object.keys(durs)) {
        if (dk.split('_')[0] === k) {
          const v = durs[dk];
          if (typeof v === 'number' && v > 0) return v;
        }
      }
    }
  }
  for (const f of fallbacks) if (typeof f === 'number' && f > 0) return f;
  return 0;
}

/** Self-buff fields for offensive click buffs (Build Up / Aim / Soul Drain /
 *  Hasten / Follow Up) — separate from the foe-debuff keys, so a −ToHit debuff
 *  never lands here. */
const SELF_BUFF_KEYS = ['damageBuff', 'tohitBuff', 'rechargeBuff'] as const;

/** Self-buff window (seconds), or 0 when the power isn't a self-buff. */
function selfBuffWindow(power: SelectedPower): number {
  const e = power.effects;
  if (!e) return 0;
  const present = SELF_BUFF_KEYS.filter((k) => e[k] != null);
  if (present.length === 0) return 0;
  return resolveEffectDuration(e, present, [e.buffDuration]);
}

/** Foe-debuff keys (target-facing) that warrant a duration "window" on the
 *  timeline. Deliberately a CURATED subset of the effect-registry's
 *  `category: 'debuff'` entries — not all of them qualify: `enduranceCrash` is a
 *  self-penalty crash, and `enduranceDrain` / `specialDebuff` are instant or
 *  odd-shaped, none of which represent a maintained foe debuff. Driving this
 *  from the registry verbatim would draw spurious windows for those. Powers
 *  flagged `selfPenalty` (Granite Armor etc.) reuse some of these as
 *  self-downsides and are excluded by `foeDebuffWindow`. */
const FOE_DEBUFF_KEYS = [
  'tohitDebuff',
  'defenseDebuff',
  'resistanceDebuff',
  'damageDebuff',
  'regenDebuff',
  'recoveryDebuff',
  'rechargeDebuff',
  'accuracyDebuff',
  'slow',
  'threatDebuff',
  'perceptionDebuff',
] as const;

/** Foe-debuff window (seconds) for any power applying a debuff to enemies —
 *  Touch of Fear −ToHit, Dark Melee −ToHit, −Res/−Regen attacks, etc. Unlike
 *  self-buffs this applies to damaging attacks too. Uses the duration of
 *  whichever present debuff actually has one (not blindly the first key), then
 *  the power-level debuff/effect duration. 0 = no debuff. */
function foeDebuffWindow(power: SelectedPower): number {
  const e = power.effects;
  if (!e || e.selfPenalty) return 0;
  const present = FOE_DEBUFF_KEYS.filter((k) => e[k] != null);
  if (present.length === 0) return 0;
  return resolveEffectDuration(e, present, [e.effectDuration, e.buffDuration]);
}

/** Self endurance gained on cast by a click recovery power (Dark Consumption /
 *  Consume / Power Sink), scaled by the targets-hit slider. enduranceGain is a
 *  percent of the 100-endurance base (so the resolved value ≈ endurance points);
 *  EndMod enhancement scales it. The per-target formula matches the InfoPanel:
 *  scale + perTarget·(targetsHit − 1) — at 0 targets a per-foe power nets 0. */
function selfEnduranceGain(
  power: SelectedPower,
  targetsHit: number,
  endMod: number,
  archetypeId: string,
  level: number,
): number {
  const eg = power.effects?.enduranceGain;
  if (eg == null) return 0;
  let value: number;
  if (typeof eg === 'number') {
    value = eg;
  } else {
    const scale = eg.scale + (eg.perTarget ?? 0) * (targetsHit - 1);
    value = scale * (getTableValue(archetypeId, eg.table, level) ?? 1);
  }
  value *= 1 + endMod;
  return value > 0 ? value : 0;
}

/** Build the per-power chain data for the current build. `targetsHit` maps a
 *  power's name → the targets-hit slider value (for per-target effects like the
 *  endurance gain on Dark Consumption); defaults to none. */
export function buildChainPowers(
  build: Build,
  globalBonuses: GlobalBonuses,
  mechCtx: AtMechanicContext,
  targetsHit: Record<string, number> = {},
): ChainPower[] {
  const globalForCalc = convertGlobalBonusesToAspects(globalBonuses);
  const archetypeId = build.archetype?.id ?? undefined;

  return collectCandidates(build).map(({ power, powersetName, powersetId, category, bucket }) => {
    const enh = calculatePowerEnhancementBonuses(
      { name: power.name, slots: power.slots },
      build.level,
      getIOSet,
    );

    const baseRecharge = powerBaseRecharge(power);
    const baseEnd = powerEndCost(power);
    const cast = calculateArcanaTime(powerCastTime(power));
    const endCost = calcThreeTier('endurance', baseEnd, enh, globalForCalc).final;

    // Direct + DoT damage, fully enhanced + global +damage (which already folds
    // in additive strength buffs like Brute Fury / Defender Vigilance). The
    // multiplicative AT mechanics (crit/scourge/containment) are applied below.
    const hasDamage = !!power.damage || !!power.effects?.damage;
    const dmg = hasDamage
      ? calculatePowerDamage(
          power,
          { level: build.level, archetypeId, primaryName: powersetName, primaryCategory: category },
          { damage: enh.damage || 0 },
          globalForCalc.damage ?? 0,
          0,
        )
      : null;

    // Pure-DoT powers (Shadow Maul, Gloom, Disintegrate) carry the PER-TICK
    // value in `final` (the calc copies dotDamage.base into base), so there's
    // no separate direct hit and the real damage is the DoT total. Mirror
    // DamageBlock's pure-DoT detection so a tick isn't double-counted.
    const dotData = dmg?.dotDamage ?? null;
    const isPureDot = dotData ? Math.abs((dmg?.base ?? 0) - dotData.base) <= 0.001 : false;
    const directHit = isPureDot ? 0 : (dmg?.final ?? 0);
    const dotTotal = dotData ? dotData.final * dotData.ticks : 0;

    // In-cast vs after-cast DoT. A DoT whose duration fits inside the cast
    // animation ticks DURING the swing — only Shadow Maul-style flurries — so
    // fold it into the hit, draw no trailing marks, and never truncate it. A
    // DoT that outlasts the animation lingers AFTER the cast (Midnight Grasp,
    // Gloom, Disintegrate, the fire-blast burns) — draw trailing marks and let
    // them truncate at the loop boundary. Verified against in-game DoT timing.
    const rawCast = powerCastTime(power);
    const dotInCast = !!dotData && dotData.duration > 0 && dotData.duration <= rawCast + 0.05;

    // Expected slotted-proc damage per cast — the same helper the DamageBlock
    // "+proc" annotation uses, so the chain DPS matches the power tooltip.
    // Proc chance keys off base + LOCAL recharge, never global.
    const radius = powerRadius(power);
    const procDmg = calculateSlottedProcDamagePerCast({
      slots: power.slots,
      baseRecharge,
      castTime: rawCast,
      radius,
      arcDegrees: radius > 0 ? (arcToDegrees(powerArc(power)) || 360) : 360,
      rechargeEnh: enh.recharge || 0,
      buildLevel: build.level,
    });

    // AT hit-time multiplier (crit / scourge / containment / assassination /
    // opportunity) — applies to base damage + DoT, NOT procs. Single-sourced
    // with the InfoPanel via resolveAtMechanic. 1.0 when no mechanic is active.
    const mechMult = atMechanicMultiplier(powersetId, mechCtx);

    // Trailing marks only for after-cast DoT; in-cast DoT is already in `damage`.
    const dot = dotData && !dotInCast
      ? { ticks: dotData.ticks, period: dotData.tickRate, perTick: dotData.final * mechMult }
      : null;
    // Always-counted damage = (hit + in-cast DoT) × AT mult + procs. After-cast
    // DoT ticks (already × mult) are added per-tick by the chain math.
    const damage = mechMult * (directHit + (dotInCast ? dotTotal : 0)) + procDmg;
    // Self-buff (Build Up / Aim / Soul Drain / Follow Up / Power Siphon) and foe
    // debuff (Touch of Fear −ToHit, −Res/−Def attacks) windows. Both ride on
    // damaging attacks too — Soul Drain & Follow Up deal damage AND self-buff —
    // so neither is gated on damage. Self-buff wins if a power does both.
    const buffDur = selfBuffWindow(power);
    const debuffDur = buffDur > 0 ? 0 : foeDebuffWindow(power);
    const effectWindow =
      buffDur > 0
        ? { kind: 'buff' as const, duration: buffDur }
        : debuffDur > 0
          ? { kind: 'debuff' as const, duration: debuffDur }
          : undefined;
    const type: ChainPowerType =
      damage > 0 || dot ? 'attack' : buffDur > 0 ? 'buff' : 'utility';

    const endGain = selfEnduranceGain(
      power,
      // The targets-hit slider is keyed by internalName everywhere (dashboard,
      // active-buffs) — match that so the user's setting actually applies.
      targetsHit[power.internalName] ?? 0,
      enh.enduranceMod || 0,
      archetypeId ?? '',
      build.level,
    );

    return {
      id: `${bucket}:${power.internalName}`,
      name: power.name,
      type,
      cast,
      baseRecharge,
      rechargeEnh: enh.recharge || 0,
      endCost,
      endGain: endGain || undefined,
      damage,
      dot,
      effectWindow,
    } satisfies ChainPower;
  });
}

/** Character endurance parameters for the sustainability sim. */
export function getEnduranceParams(globalBonuses: GlobalBonuses): EnduranceParams {
  const maxEnd = 100 + (globalBonuses.maxEndurance || 0);
  return {
    maxEnd,
    recoveryPerSec: (maxEnd / 60) * (1 + (globalBonuses.recovery || 0) / 100),
    togglePerSec: globalBonuses.toggleEndCost || 0,
  };
}

/** The build's global recharge bonus as a percentage (e.g. 70 = +70%). */
export function getBuildGlobalRecharge(globalBonuses: GlobalBonuses): number {
  return globalBonuses.recharge || 0;
}

// ---------------------------------------------------------------------------
// Saved-chain persistence: convert between the runtime pi-sequence (indices
// into ChainPower[]) and the stable id list stored on the build. Storing
// indices would break the moment the build's power set changes; ids
// ("bucket:internalName") are stable, so a saved chain survives reload, export,
// and share — and gracefully drops any power that's no longer picked.
// ---------------------------------------------------------------------------

/** The stable internalName portion of a ChainPower id ("bucket:internalName").
 *  Fallback match key so a saved chain survives pool-slot reshuffles (which can
 *  change the bucket prefix) as long as the power is still in the build. */
function chainIdInternalName(id: string): string {
  const i = id.indexOf(':');
  return i >= 0 ? id.slice(i + 1) : id;
}

/** A working pi-sequence → the stable id list stored in a saved AttackChain. */
export function sequenceToIds(powers: ChainPower[], sequence: number[]): string[] {
  return sequence.map((pi) => powers[pi]?.id).filter((id): id is string => !!id);
}

/** A saved AttackChain's id list → a pi-sequence for the CURRENT build's
 *  powers. Matches each id exactly, then falls back to its internalName; ids
 *  with no surviving power are dropped. */
export function idsToSequence(powers: ChainPower[], ids: string[]): number[] {
  const out: number[] = [];
  for (const id of ids) {
    let pi = powers.findIndex((p) => p.id === id);
    if (pi < 0) {
      const inm = chainIdInternalName(id);
      pi = powers.findIndex((p) => chainIdInternalName(p.id) === inm);
    }
    if (pi >= 0) out.push(pi);
  }
  return out;
}
