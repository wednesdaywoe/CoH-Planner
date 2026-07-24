/**
 * SPIKE5 — pure engine→beta key mapping (no engine/wasm import, so it runs anywhere:
 * browser, the totals hook, and the SPIKE6 Node parity harness). Reshapes the engine's
 * snake_case `CalculatedTotals` to the beta camelCase `CharacterStats` / `GlobalBonuses`.
 * See engineTotals.ts for the notes on movement (a GlobalBonuses field in the engine) and
 * the beta-only fields with no engine source (`threatLevel`, `protRepel`, …).
 */

import type { CharacterStats, BonusTracking, ValueTracking, StatSource, DashboardStatBreakdown } from '@/utils/calculations';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

export interface EngineStats {
  damage: number; accuracy: number; to_hit: number; recharge: number; endurance_reduction: number;
  def_melee: number; def_ranged: number; def_aoe: number;
  def_sl: number; def_fc: number; def_en: number; def_psionic: number; def_toxic: number;
  res_sl: number; res_fc: number; res_en: number; res_psionic: number; res_toxic: number;
  recovery: number; regeneration: number; max_hp: number; max_end: number;
  debuff_resist_slow: number; debuff_resist_defense: number; debuff_resist_recharge: number; debuff_resist_endurance: number;
  debuff_resist_recovery: number; debuff_resist_to_hit: number; debuff_resist_regeneration: number; debuff_resist_perception: number;
}

export interface EngineBonuses {
  damage: number; accuracy: number; to_hit: number; recharge: number; endurance: number; range: number;
  defense_melee: number; defense_ranged: number; defense_aoe: number;
  defense_smashing: number; defense_lethal: number; defense_fire: number; defense_cold: number;
  defense_energy: number; defense_negative: number; defense_psionic: number; defense_toxic: number;
  resistance_smashing: number; resistance_lethal: number; resistance_fire: number; resistance_cold: number;
  resistance_energy: number; resistance_negative: number; resistance_psionic: number; resistance_toxic: number;
  max_hp: number; max_endurance: number; absorb: number; regeneration: number; recovery: number;
  run_speed: number; jump_height: number; jump_speed: number; fly_speed: number;
  mez_resist: number;
  mez_resist_hold: number; mez_resist_stun: number; mez_resist_immobilize: number; mez_resist_sleep: number;
  mez_resist_confuse: number; mez_resist_fear: number; mez_resist_knockback: number;
  protection_hold: number; protection_stun: number; protection_immobilize: number; protection_sleep: number;
  protection_confuse: number; protection_fear: number; protection_knockback: number;
  debuff_resist_slow: number; debuff_resist_defense: number; debuff_resist_recharge: number; debuff_resist_endurance: number;
  debuff_resist_recovery: number; debuff_resist_to_hit: number; debuff_resist_regeneration: number; debuff_resist_perception: number;
  heal_other: number; heal_received: number;
  stealth_radius_pve: number; stealth_radius_pvp: number; perception_radius: number;
  mez_resist_taunt: number; mez_resist_placate: number;
  level_shift: number;
  base_to_hit: number; hit_chance: number; combat_modifier: number;
  strength_defense: number; strength_to_hit: number; strength_heal: number; strength_absorb: number;
  strength_end_mod: number; strength_movement: number; strength_mez: number;
  immobilize_duration: number; hold_duration: number; stun_duration: number; sleep_duration: number;
  confuse_duration: number; terror_duration: number;
  errors: { context: string; detail: string }[];
}

/** One accepted/rejected set-bonus instance (engine `BonusSourceRef`). The engine owns the
 *  accept/reject decision; the display name is resolved here from the build. */
export interface EngineBonusSourceRef {
  power_internal_name: string;
  power_set: string;
  set_name: string;
  pieces: number;
}

/** One Rule-of-5 bucket for a `(stat, value)` pair (engine `ValueBucket`). */
export interface EngineValueBucket {
  value: number;
  count: number;
  capped: boolean;
  sources: EngineBonusSourceRef[];
  rejected_sources: EngineBonusSourceRef[];
}

/** One tracked stat's buckets + its beta routing (engine `SetBonusStatTracking`). */
export interface EngineSetBonusTracking {
  /** Beta internal stat key — the `bonusTracking` map key the UI looks up. */
  stat_key: string;
  /** camelCase dashboard breakdown-map key(s) the sources surface under. */
  breakdown_keys: string[];
  /** 2-dp value key → bucket. */
  buckets: Record<string, EngineValueBucket>;
}

export interface EngineTotals {
  stats: EngineStats;
  bonuses: EngineBonuses;
  set_bonus_tracking: EngineSetBonusTracking[];
}

/** Resolves an engine source ref to the slotting power's display name. Built from the same
 *  build the engine read; falls back to the internal name if a power can't be located. */
export type PowerNameResolver = (ref: EngineBonusSourceRef) => string;

/** The beta's source-string format (`collectAllSetBonuses`): `${set} (${pieces}pc in ${power})`. */
function sourceLabel(ref: EngineBonusSourceRef, powerName: string): string {
  return `${ref.set_name} (${ref.pieces}pc in ${powerName})`;
}

/**
 * Reshape the engine's set-bonus tracking into the beta `BonusTracking` — the `(x/5)` counters
 * and capped-strikethrough in the enhancement / set-bonus tooltips. Keyed by the engine's beta
 * stat key (which equals the UI's `normalizeStatName` output) then the 2-dp value key, matching
 * `{ [stat]: { [valueKey]: ValueTracking } }`.
 */
export function mapBonusTracking(
  tracking: EngineSetBonusTracking[],
  resolveName: PowerNameResolver,
): BonusTracking {
  const out: BonusTracking = {};
  const toTracked = (ref: EngineBonusSourceRef) => {
    const powerName = resolveName(ref);
    return { name: sourceLabel(ref, powerName), powerName };
  };
  for (const stat of tracking) {
    const byValue: Record<string, ValueTracking> = {};
    for (const [valueKey, bucket] of Object.entries(stat.buckets)) {
      byValue[valueKey] = {
        count: bucket.count,
        capped: bucket.capped,
        value: bucket.value,
        sources: bucket.sources.map(toTracked),
        rejectedSources: bucket.rejected_sources.map(toTracked),
      };
    }
    out[stat.stat_key] = byValue;
  }
  return out;
}

/**
 * Reshape the engine's set-bonus tracking into the dashboard `breakdown` map's set-bonus sources
 * — the per-stat tooltip rows, the over-cap ring (`powerName` + `capped`), and the Rule-of-5
 * banner. A faithful port of the beta's Step 3 (`character-totals.ts:4280`) + `buildStatBreakdown`:
 * each accepted instance is a `capped:false` source, each rejected instance a `capped:true` one,
 * the bucket total is `value × count`, and a stat fans out to every `breakdown_keys` entry
 * (`+Res(Recharge Debuff)` → both recharge and slow).
 */
export function mapSetBonusBreakdown(
  tracking: EngineSetBonusTracking[],
  resolveName: PowerNameResolver,
): Map<string, DashboardStatBreakdown> {
  const breakdown = new Map<string, DashboardStatBreakdown>();
  for (const stat of tracking) {
    const sources: StatSource[] = [];
    let cappedSources = 0;
    let total = 0;
    for (const bucket of Object.values(stat.buckets)) {
      for (const ref of bucket.sources) {
        const powerName = resolveName(ref);
        sources.push({ name: sourceLabel(ref, powerName), value: bucket.value, type: 'set-bonus', capped: false, powerName });
      }
      for (const ref of bucket.rejected_sources) {
        const powerName = resolveName(ref);
        sources.push({ name: sourceLabel(ref, powerName), value: bucket.value, type: 'set-bonus', capped: true, powerName });
        cappedSources++;
      }
      total += bucket.value * bucket.count;
    }
    for (const key of stat.breakdown_keys) {
      const existing = breakdown.get(key);
      if (existing) {
        existing.sources.push(...sources);
        existing.total += total;
        existing.cappedSources += cappedSources;
      } else {
        // Clone the source array so paired stats don't share a mutable reference.
        breakdown.set(key, { total, base: 0, sources: [...sources], cappedSources });
      }
    }
  }
  return breakdown;
}

export function mapStats(s: EngineStats, b: EngineBonuses): CharacterStats {
  return {
    damage: s.damage, accuracy: s.accuracy, tohit: s.to_hit, recharge: s.recharge, endrdx: s.endurance_reduction,
    defMelee: s.def_melee, defRanged: s.def_ranged, defAoE: s.def_aoe,
    defSL: s.def_sl, defFC: s.def_fc, defEN: s.def_en, defPsionic: s.def_psionic, defToxic: s.def_toxic,
    resSL: s.res_sl, resFC: s.res_fc, resEN: s.res_en, resPsionic: s.res_psionic, resToxic: s.res_toxic,
    recovery: s.recovery, regeneration: s.regeneration, maxhp: s.max_hp, maxend: s.max_end,
    // Movement is a GlobalBonuses field in the engine, not CharacterStats.
    runspeed: b.run_speed, flyspeed: b.fly_speed, jumpspeed: b.jump_speed, jumpheight: b.jump_height,
    debuffResistSlow: s.debuff_resist_slow, debuffResistDefense: s.debuff_resist_defense,
    debuffResistRecharge: s.debuff_resist_recharge, debuffResistEndurance: s.debuff_resist_endurance,
    debuffResistRecovery: s.debuff_resist_recovery, debuffResistToHit: s.debuff_resist_to_hit,
    debuffResistRegeneration: s.debuff_resist_regeneration, debuffResistPerception: s.debuff_resist_perception,
  };
}

export function mapGlobal(b: EngineBonuses): GlobalBonuses {
  return {
    damage: b.damage, accuracy: b.accuracy, toHit: b.to_hit, recharge: b.recharge, endurance: b.endurance, range: b.range,
    defMelee: b.defense_melee, defRanged: b.defense_ranged, defAoE: b.defense_aoe,
    defSmashing: b.defense_smashing, defLethal: b.defense_lethal, defFire: b.defense_fire, defCold: b.defense_cold,
    defEnergy: b.defense_energy, defNegative: b.defense_negative, defPsionic: b.defense_psionic, defToxic: b.defense_toxic,
    resSmashing: b.resistance_smashing, resLethal: b.resistance_lethal, resFire: b.resistance_fire, resCold: b.resistance_cold,
    resEnergy: b.resistance_energy, resNegative: b.resistance_negative, resPsionic: b.resistance_psionic, resToxic: b.resistance_toxic,
    maxHP: b.max_hp, maxEndurance: b.max_endurance, absorb: b.absorb, regeneration: b.regeneration, recovery: b.recovery,
    runSpeed: b.run_speed, jumpHeight: b.jump_height, jumpSpeed: b.jump_speed, flySpeed: b.fly_speed,
    mezResist: b.mez_resist,
    mezResistHold: b.mez_resist_hold, mezResistStun: b.mez_resist_stun, mezResistImmobilize: b.mez_resist_immobilize,
    mezResistSleep: b.mez_resist_sleep, mezResistConfuse: b.mez_resist_confuse, mezResistFear: b.mez_resist_fear,
    mezResistKnockback: b.mez_resist_knockback,
    protHold: b.protection_hold, protStun: b.protection_stun, protImmobilize: b.protection_immobilize,
    protSleep: b.protection_sleep, protConfuse: b.protection_confuse, protFear: b.protection_fear,
    protKnockback: b.protection_knockback,
    debuffResistSlow: b.debuff_resist_slow, debuffResistDefense: b.debuff_resist_defense,
    debuffResistRecharge: b.debuff_resist_recharge, debuffResistEndurance: b.debuff_resist_endurance,
    debuffResistRecovery: b.debuff_resist_recovery, debuffResistToHit: b.debuff_resist_to_hit,
    debuffResistRegeneration: b.debuff_resist_regeneration, debuffResistPerception: b.debuff_resist_perception,
    healOther: b.heal_other, healReceived: b.heal_received, threatLevel: 0,
    stealthRadiusPvE: b.stealth_radius_pve, stealthRadiusPvP: b.stealth_radius_pvp, perceptionRadius: b.perception_radius,
    protRepel: 0, protTeleport: 0,
    mezResistTaunt: b.mez_resist_taunt, mezResistPlacate: b.mez_resist_placate,
    levelShift: b.level_shift,
    toggleEndCost: 0, enduranceDiscount: 0, netEndPerSec: 0,
    baseToHit: b.base_to_hit, hitChance: b.hit_chance, combatModifier: b.combat_modifier,
    strengthDefense: b.strength_defense, strengthToHit: b.strength_to_hit, strengthHeal: b.strength_heal,
    strengthAbsorb: b.strength_absorb, strengthEndMod: b.strength_end_mod, strengthMovement: b.strength_movement,
    strengthMez: b.strength_mez,
    immobilizeDuration: b.immobilize_duration, holdDuration: b.hold_duration, stunDuration: b.stun_duration,
    sleepDuration: b.sleep_duration, confuseDuration: b.confuse_duration, terrorDuration: b.terror_duration,
  };
}
