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
import { applyQuickSnipe } from '@/utils/quick-snipe';
import type { ChainPower, ChainDoT, ChainForm, ChainPowerType, EnduranceParams, FormTrigger } from './attack-chain';

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

/**
 * Powers with an alternate "build/spend" cast form in the chain, keyed by
 * internalName. Slice 1: Energy Transfer's Energy-Focus fast cast — the only
 * divergence from the base power is the animation time (1.0s vs the base
 * 2.67s); damage and endurance match, so the form spec carries just `castTime`.
 * The fast form is gated on an `energy_focus` charge that Total Focus grants
 * (see CHARGE_GRANTS). Sourced from the redirect data
 * (exported_powers/redirects/energy_melee/energy_transfer_fast.json).
 *
 * This table lives at the chain layer for now; once the converter extracts
 * redirect forms it migrates onto the Power data. Reserved triggers (`tohit`
 * for fast snipes, `hidden` for Assassin's Strike) plug in here too.
 */
interface FormSpec {
  id: string;
  label: string;
  kind: 'fast' | 'slow';
  /** Overrides the base cast time (seconds, pre-ArcanaTime); omit to inherit. */
  castTime?: number;
  trigger: FormTrigger;
}
const POWER_FORMS: Record<string, FormSpec[]> = {
  Energy_Transfer: [
    { id: 'fast', label: 'Energy Focus', kind: 'fast', castTime: 1.0, trigger: { type: 'charge', resource: 'energy_focus' } },
  ],
};
/** internalName → the consumable charge the power grants when cast. Placate
 *  re-Hides you, so it grants `hidden` — the marker the chain checks to let an
 *  immediately-following Assassin's Strike fire its slow from-Hide form. */
const CHARGE_GRANTS: Record<string, string> = { Total_Focus: 'energy_focus', Placate: 'hidden' };

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

/** Window (seconds) during which this power's ToHit buff is active — Build Up,
 *  Aim, Soul Drain. Gated specifically on a ToHit buff (not the broader
 *  self-buff set) so a recharge-only buff like Hasten doesn't wrongly mark a
 *  snipe fast. 0 when the power grants no ToHit buff. */
function toHitBuffWindow(power: SelectedPower): number {
  const e = power.effects;
  if (!e || (e.tohitBuff == null && e.tohitBuffUnenhanced == null)) return 0;
  return selfBuffWindow(power);
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
    const endCost = calcThreeTier('endurance', baseEnd, enh, globalForCalc).final;

    // AT hit-time multiplier (crit / scourge / containment / assassination /
    // opportunity) — applies to base damage + DoT, NOT procs. Single-sourced
    // with the InfoPanel via resolveAtMechanic. 1.0 when no mechanic is active.
    const mechMult = atMechanicMultiplier(powersetId, mechCtx, power.fromHideBonus);

    // Assassin's Strike models from-Hide POSITIONALLY (opener / post-Placate)
    // via a slow `hidden` form, not the global hidden toggle. So its base is the
    // fast mid-combat Quick cast with the mid-combat multiplier (the global
    // toggle is ignored for AS to avoid double-counting), and the from-Hide hit
    // becomes an alternate form below. Only HC's two-redirect AS carries
    // midCombatCast; Rebirth's single-form AS falls through to the normal path.
    const isAS = power.fromHideBonus != null && power.midCombatCast != null;
    const asMidPower: SelectedPower | null = isAS
      ? { ...power, stats: { ...power.stats, castTime: power.midCombatCast, interruptTime: undefined } }
      : null;
    const basePower = asMidPower ?? power;
    const baseMult = isAS
      ? atMechanicMultiplier(powersetId, { ...mechCtx, effectiveHidden: false })
      : mechMult;
    const cast = calculateArcanaTime(powerCastTime(basePower));

    // Derive a form's chain damage (direct + in-cast DoT × AT mult + procs) and
    // its after-cast DoT. Run for the base power, and again for a snipe's
    // In-Combat fast variant — which has BOTH lower damage and a shorter cast
    // (→ different proc chance), so the fast form's numbers must be recomputed,
    // not scaled from the slow form's. `mult` defaults to the base power's AT
    // multiplier; a form (AS from-Hide) can pass its own.
    const deriveDamage = (p: SelectedPower, mult: number = baseMult): { damage: number; dot: ChainDoT | null } => {
      const hasDamage = !!p.damage || !!p.effects?.damage;
      const dmg = hasDamage
        ? calculatePowerDamage(
            p,
            { level: build.level, archetypeId, primaryName: powersetName, primaryCategory: category },
            { damage: enh.damage || 0 },
            globalForCalc.damage ?? 0,
            0,
          )
        : null;
      // Pure-DoT powers carry the per-tick value in `final`; mirror DamageBlock's
      // detection so a tick isn't double-counted.
      const dotData = dmg?.dotDamage ?? null;
      const isPureDot = dotData ? Math.abs((dmg?.base ?? 0) - dotData.base) <= 0.001 : false;
      const directHit = isPureDot ? 0 : (dmg?.final ?? 0);
      const dotTotal = dotData ? dotData.final * dotData.ticks : 0;
      // A DoT that fits inside the animation ticks during the swing (fold into
      // the hit); one that outlasts it lingers after the cast (trailing marks).
      const rawCastP = powerCastTime(p);
      const dotInCast = !!dotData && dotData.duration > 0 && dotData.duration <= rawCastP + 0.05;
      // Slotted-proc damage keys off base + LOCAL recharge and the cast time, so
      // a shorter (fast-snipe) cast yields a different PPM chance.
      const radiusP = powerRadius(p);
      const procDmg = calculateSlottedProcDamagePerCast({
        slots: p.slots,
        baseRecharge,
        castTime: rawCastP,
        radius: radiusP,
        arcDegrees: radiusP > 0 ? (arcToDegrees(powerArc(p)) || 360) : 360,
        rechargeEnh: enh.recharge || 0,
        buildLevel: build.level,
      });
      const dot = dotData && !dotInCast
        ? { ticks: dotData.ticks, period: dotData.tickRate, perTick: dotData.final * mult }
        : null;
      const damage = mult * (directHit + (dotInCast ? dotTotal : 0)) + procDmg;
      return { damage, dot };
    };

    const { damage, dot } = deriveDamage(basePower);
    // Snipe In-Combat (fast) form: applyQuickSnipe swaps in the reduced-damage,
    // shorter-cast variant; the chain auto-uses it when the build meets the
    // fast-snipe ToHit threshold or a ToHit-buff window is active (replayChain).
    const fastPower = power.quickSnipe ? applyQuickSnipe(power, true) : null;
    const fastSnipe = fastPower ? deriveDamage(fastPower) : null;
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

    // Alternate cast forms. Energy Transfer's fast cast comes from POWER_FORMS
    // (reuses the base damage, overrides only the animation). Snipes add an
    // In-Combat fast form synthesized from quickSnipe — its own reduced damage
    // and ~1.67s cast — gated on the ToHit fast-snipe rule.
    const forms: ChainForm[] = (POWER_FORMS[power.internalName] ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      kind: s.kind,
      cast: s.castTime != null ? calculateArcanaTime(s.castTime) : cast,
      damage,
      endCost,
      dot,
      trigger: s.trigger,
    }));
    if (fastPower && fastSnipe) {
      forms.push({
        id: 'fast',
        label: 'Fast Snipe',
        kind: 'fast',
        cast: calculateArcanaTime(powerCastTime(fastPower)),
        damage: fastSnipe.damage,
        endCost,
        dot: fastSnipe.dot,
        trigger: { type: 'tohit', threshold: 22 },
      });
    }
    if (isAS) {
      // From-Hide form: the slow interruptible animation (the original base
      // castTime) delivering the guaranteed Assassination hit (mid-combat base ×
      // (1 + fromHideBonus), procs excluded). Legal as the rotation opener or
      // immediately after Placate (replayChain enforces the position).
      const hidden = deriveDamage(power, 1 + (power.fromHideBonus ?? 0));
      forms.push({
        id: 'hidden',
        label: 'From Hide',
        kind: 'slow',
        cast: calculateArcanaTime(powerCastTime(power)),
        damage: hidden.damage,
        endCost,
        dot: hidden.dot,
        trigger: { type: 'hidden' },
      });
    }
    const grants = CHARGE_GRANTS[power.internalName];
    // Window (seconds) during which this power's ToHit buff makes a snipe fast
    // (Build Up / Aim / Soul Drain) — NOT a recharge-only buff like Hasten.
    const tohitWin = toHitBuffWindow(power);

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
      ...(forms.length ? { forms } : {}),
      ...(grants && { grants }),
      ...(tohitWin ? { tohitWindow: tohitWin } : {}),
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
