/**
 * Pet Damage Calculation
 *
 * Calculates DPS for summoned pets/pseudopets using pet class tables.
 * Supports the three-tier display: Base → Enhanced → Final
 */

import { PET_ENTITIES, type PetAbility } from '@/data/pet-entities';
import { getPetTableValue, getTableValue } from '@/data/at-tables';
import type { ResolvedPseudoPet } from '@/types/power';

// ============================================
// TYPES
// ============================================

export interface PetAbilityDamage {
  ability: PetAbility;
  /** Total base damage per activation (sum of all damage types) */
  damagePerHit: number;
  /** Base DPS contribution from this ability */
  dps: number;
  /** Enhanced damage per hit (with caster's enhancement bonus) */
  damagePerHitEnhanced: number;
  /** Enhanced DPS */
  dpsEnhanced: number;
  /** Final damage per hit (with buffs) */
  damagePerHitFinal: number;
  /** Final DPS */
  dpsFinal: number;
  /** Cycle time for this ability in seconds */
  cycleTime: number;
  /** Damage breakdown by type */
  damageByType: { type: string; base: number; enhanced: number; final: number }[];
}

export interface PetEffectComputed {
  type: string;
  /** Computed value at current level (from scale*table or magnitude) */
  value?: number;
  chance?: number;
  /** IgnoreStrength: the player's enhancements/buffs do NOT scale this (informational). */
  ignoreStrength?: boolean;
}

export interface PetDamageResult {
  entityName: string;
  displayName: string;
  entityCount: number;
  duration?: number;
  abilities: PetAbilityDamage[];
  /** All non-damage abilities (effects only, no damage) */
  effectOnlyAbilities: PetAbility[];
  /** Aggregated unique effects with computed values */
  allEffects: PetEffectComputed[];
  /** Per-entity totals */
  totalDpsBase: number;
  totalDpsEnhanced: number;
  totalDpsFinal: number;
  /** Multiplied by entityCount */
  aggregateDpsBase: number;
  aggregateDpsEnhanced: number;
  aggregateDpsFinal: number;
}

// ============================================
// CONSTANTS
// ============================================

/** Minimum server tick / arcana time (3 server ticks at 30fps) */
const ARCANA_TIME = 0.132 * 3; // ~0.396s

// ============================================
// CALCULATION
// ============================================

/**
 * Calculate the base damage for a pet ability at a given level.
 * Uses the pet class table values (stored as negative, so we abs them).
 */
function calculateAbilityBaseDamage(
  ability: PetAbility,
  characterClass: string,
  level: number
): { type: string; base: number }[] {
  const results: { type: string; base: number }[] = [];

  for (const dmg of ability.damage) {
    const tableValue = getPetTableValue(characterClass, dmg.table, level);
    if (tableValue === undefined) continue;

    const base = Math.abs(tableValue) * Math.abs(dmg.scale);
    results.push({ type: dmg.damageType, base });
  }

  return results;
}

/**
 * Calculate the cycle time for a pet ability.
 * Click: max(castTime, arcanaTime) + rechargeTime
 * Auto: activatePeriod (fires every N seconds)
 */
function calculateCycleTime(ability: PetAbility): number {
  if (ability.type === 'Auto' && ability.activatePeriod && ability.activatePeriod > 0) {
    return ability.activatePeriod;
  }

  // Click or Toggle attacks
  const castTime = Math.max(ability.castTime || 0, ARCANA_TIME);
  const recharge = ability.recharge || 0;
  return castTime + recharge;
}

/**
 * Calculate pet damage for a given entity.
 *
 * @param entityName - Entity definition name (key into PET_ENTITIES)
 * @param level - Character level (1-54)
 * @param entityCount - Number of entities summoned (e.g., 2 for Gremlins)
 * @param duration - Duration in seconds (undefined = permanent)
 * @param enhancementBonus - Damage enhancement bonus (0-1+), applied if copyBoosts/copyCreatorMods
 * @param applyEnhancements - Whether to apply enhancement bonus (based on copyBoosts/copyCreatorMods)
 * @param globalDamageBonus - Global damage bonus from buffs (as decimal, e.g., 0.30 = +30%)
 * @param upgradeTier - Upgrade tier for MM pets: 0=base, 1=first upgrade, 2=both upgrades
 */
export function calculatePetDamage(
  entityName: string,
  level: number = 50,
  entityCount: number = 1,
  duration?: number,
  enhancementBonus: number = 0,
  applyEnhancements: boolean = false,
  globalDamageBonus: number = 0,
  upgradeTier: number = 0
): PetDamageResult | null {
  const entity = PET_ENTITIES[entityName];
  if (!entity) return null;

  // Build the combined ability list: base + upgrade tiers
  let allAbilities: PetAbility[] = [...entity.abilities];
  if (upgradeTier >= 1 && entity.upgradeTiers) {
    const tier2 = entity.upgradeTiers.find(t => t.tier === 2);
    if (tier2) allAbilities = [...allAbilities, ...tier2.abilities];
  }
  if (upgradeTier >= 2 && entity.upgradeTiers) {
    const tier3 = entity.upgradeTiers.find(t => t.tier === 3);
    if (tier3) allAbilities = [...allAbilities, ...tier3.abilities];
  }

  const abilities: PetAbilityDamage[] = [];
  const effectOnlyAbilities: PetAbility[] = [];
  const allEffectsMap = new Map<string, PetEffectComputed>();
  let totalDpsBase = 0;
  let totalDpsEnhanced = 0;
  let totalDpsFinal = 0;

  for (const ability of allAbilities) {
    // Collect effects from all abilities, computing values from table lookups
    if (ability.effects) {
      for (const eff of ability.effects) {
        if (!allEffectsMap.has(eff.type)) {
          let value: number | undefined;
          if (eff.scale && eff.table) {
            const tableValue = getPetTableValue(entity.characterClass, eff.table, level);
            if (tableValue !== undefined) {
              value = Math.abs(tableValue) * Math.abs(eff.scale);
            }
          } else if (eff.magnitude !== undefined) {
            value = eff.magnitude;
          }
          allEffectsMap.set(eff.type, { type: eff.type, value, chance: eff.chance });
        }
      }
    }

    // Abilities with no damage are effect-only (e.g., Static Field sleep, Tornado fear)
    if (ability.damage.length === 0) {
      effectOnlyAbilities.push(ability);
      continue;
    }

    const baseDamages = calculateAbilityBaseDamage(ability, entity.characterClass, level);
    if (baseDamages.length === 0) continue;

    const cycleTime = calculateCycleTime(ability);
    if (cycleTime <= 0) continue;

    // Sum total damage per hit across all damage types
    const damagePerHit = baseDamages.reduce((sum, d) => sum + d.base, 0);

    // Apply enhancement bonus (only if copyBoosts or copyCreatorMods)
    const enhMult = applyEnhancements ? (1 + enhancementBonus) : 1;
    const damagePerHitEnhanced = damagePerHit * enhMult;

    // Apply global damage buffs
    const buffMult = 1 + globalDamageBonus;
    const damagePerHitFinal = damagePerHitEnhanced * buffMult;

    // DPS = damage / cycleTime
    const dps = damagePerHit / cycleTime;
    const dpsEnhanced = damagePerHitEnhanced / cycleTime;
    const dpsFinal = damagePerHitFinal / cycleTime;

    // Per-type breakdown
    const damageByType = baseDamages.map(d => ({
      type: d.type,
      base: d.base,
      enhanced: d.base * enhMult,
      final: d.base * enhMult * buffMult,
    }));

    abilities.push({
      ability,
      damagePerHit,
      dps,
      damagePerHitEnhanced,
      dpsEnhanced,
      damagePerHitFinal,
      dpsFinal,
      cycleTime,
      damageByType,
    });

    totalDpsBase += dps;
    totalDpsEnhanced += dpsEnhanced;
    totalDpsFinal += dpsFinal;
  }

  // Return result even if no damage (entity may have only effects)
  if (abilities.length === 0 && effectOnlyAbilities.length === 0) return null;

  return {
    entityName,
    displayName: entity.displayName,
    entityCount,
    duration,
    abilities,
    effectOnlyAbilities,
    allEffects: Array.from(allEffectsMap.values()),
    totalDpsBase,
    totalDpsEnhanced,
    totalDpsFinal,
    aggregateDpsBase: totalDpsBase * entityCount,
    aggregateDpsEnhanced: totalDpsEnhanced * entityCount,
    aggregateDpsFinal: totalDpsFinal * entityCount,
  };
}

/**
 * Calculate damage for a SYNTHESIZED pseudo-pet (summon.resolvedEntities) — the
 * location pseudo-pets (Storm Cell, Category Five, Freezing Rain, …) whose
 * entity_def is a generic shell with no PET_ENTITIES record. Mirrors
 * calculatePetDamage but reads the **summoner's archetype** AT table
 * (getTableValue), not a fixed pet class: verified in-game, a level-1 Blaster's
 * Storm Cell lightning ticks 5.12 = 0.5 × Ranged_Damage(blaster,1)=10.25, and
 * the minion_pets table (−6.02) would be wrong.
 *
 * Returns a PetDamageResult so the existing InfoPanel fires-per-spawn loop can
 * consume it identically to a real pet.
 */
export function calculateResolvedPseudoPetDamage(
  entity: ResolvedPseudoPet,
  archetype: string,
  level: number = 50,
  enhancementBonus: number = 0,
  applyEnhancements: boolean = false,
  globalDamageBonus: number = 0,
): PetDamageResult | null {
  if (!entity?.abilities?.length) return null;

  const abilities: PetAbilityDamage[] = [];
  const effectOnlyAbilities: PetAbility[] = [];
  const allEffectsMap = new Map<string, PetEffectComputed>();
  let totalDpsBase = 0, totalDpsEnhanced = 0, totalDpsFinal = 0;

  const enhMult = applyEnhancements ? 1 + enhancementBonus : 1;
  const buffMult = 1 + globalDamageBonus;

  for (const ability of entity.abilities) {
    if (ability.effects) {
      for (const eff of ability.effects) {
        if (allEffectsMap.has(eff.type)) continue;
        let value: number | undefined;
        if (eff.scale && eff.table) {
          const tv = getTableValue(archetype, eff.table, level);
          if (tv !== undefined) value = Math.abs(tv) * Math.abs(eff.scale);
        } else if (eff.magnitude !== undefined) {
          value = eff.magnitude;
        }
        allEffectsMap.set(eff.type, { type: eff.type, value, ignoreStrength: eff.ignoreStrength });
      }
    }

    // Conditional (storm-strength gated / proc) damage is NOT guaranteed — keep
    // it out of the DPS/headline total and surface it as an informational effect
    // (per-tick value + chance). Mirrors how the game shows Storm Cell's lightning
    // as "chance for X / while powered up" rather than a flat DoT.
    if (ability.conditionalDamage && ability.damage.length > 0) {
      for (const dmg of ability.damage) {
        const key = `${dmg.damageType} Dmg`;
        if (allEffectsMap.has(key)) continue;
        const tv = getTableValue(archetype, dmg.table, level);
        allEffectsMap.set(key, {
          type: key,
          value: tv !== undefined ? Math.abs(tv) * Math.abs(dmg.scale) : undefined,
          chance: ability.damageChance && ability.damageChance > 0 ? ability.damageChance : undefined,
        });
      }
      if (!ability.effects || ability.effects.length === 0) continue;
    }

    if (!ability.damage || ability.damage.length === 0 || ability.conditionalDamage) {
      // No guaranteed damage to contribute to DPS — but it may still carry
      // (already-collected) debuffs/mez, so it's an effect-only ability here.
      effectOnlyAbilities.push(ability as unknown as PetAbility);
      continue;
    }

    // Proc damage (0 < damageChance < 1) counts at its EXPECTED value
    // (chance × per-hit) — the planner's proc convention. Guaranteed DoT has no
    // damageChance ⇒ multiplier 1. (chance===0 mode-gated damage never reaches
    // here; it's handled as conditional above.)
    const chanceMult = ability.damageChance ?? 1;
    const baseDamages: { type: string; base: number }[] = [];
    for (const dmg of ability.damage) {
      const tv = getTableValue(archetype, dmg.table, level);
      if (tv === undefined) continue;
      baseDamages.push({ type: dmg.damageType, base: Math.abs(tv) * Math.abs(dmg.scale) * chanceMult });
    }
    if (baseDamages.length === 0) continue;

    const cycleTime = ability.type === 'Auto' && ability.activatePeriod && ability.activatePeriod > 0
      ? ability.activatePeriod
      : Math.max(ability.castTime || 0, ARCANA_TIME) + (ability.recharge || 0);
    if (cycleTime <= 0) continue;

    const damagePerHit = baseDamages.reduce((s, d) => s + d.base, 0);
    const damagePerHitEnhanced = damagePerHit * enhMult;
    const damagePerHitFinal = damagePerHitEnhanced * buffMult;

    abilities.push({
      ability: ability as unknown as PetAbility,
      damagePerHit,
      dps: damagePerHit / cycleTime,
      damagePerHitEnhanced,
      dpsEnhanced: damagePerHitEnhanced / cycleTime,
      damagePerHitFinal,
      dpsFinal: damagePerHitFinal / cycleTime,
      cycleTime,
      damageByType: baseDamages.map(d => ({
        type: d.type, base: d.base, enhanced: d.base * enhMult, final: d.base * enhMult * buffMult,
      })),
    });
    totalDpsBase += damagePerHit / cycleTime;
    totalDpsEnhanced += damagePerHitEnhanced / cycleTime;
    totalDpsFinal += damagePerHitFinal / cycleTime;
  }

  if (abilities.length === 0 && effectOnlyAbilities.length === 0) return null;

  const count = entity.count ?? 1;
  return {
    entityName: entity.displayName,
    displayName: entity.displayName,
    entityCount: count,
    duration: entity.duration,
    abilities,
    effectOnlyAbilities,
    allEffects: Array.from(allEffectsMap.values()),
    totalDpsBase,
    totalDpsEnhanced,
    totalDpsFinal,
    aggregateDpsBase: totalDpsBase * count,
    aggregateDpsEnhanced: totalDpsEnhanced * count,
    aggregateDpsFinal: totalDpsFinal * count,
  };
}

/**
 * Determine whether a summon should apply the caster's enhancement bonus.
 * True if the entity has copyCreatorMods OR the summon template has CopyBoosts.
 */
export function shouldApplyEnhancements(
  entityName: string,
  copyBoosts?: boolean
): boolean {
  const entity = PET_ENTITIES[entityName];
  if (!entity) return false;
  return entity.copyCreatorMods || (copyBoosts === true);
}

// PetEffect.type → PowerEffects key, restricted to the ENHANCEABLE scalar
// debuffs the effect registry renders as percent (scale × table). These are
// the pseudo-pet effects a player's enhancements/global buffs actually scale —
// convert-pet-entities already drops the binary's IgnoreStrength templates, so
// what remains is enhanceable. Mez / knockback / heal have non-scalar shapes
// and stay in the Summons block.
const PSEUDO_PET_ENHANCEABLE_EFFECT: Record<string, keyof import('@/types/power').PowerEffects> = {
  Slow: 'slow',
  DefenseDebuff: 'defenseDebuff',
  ToHitDebuff: 'tohitDebuff',
  ResistanceDebuff: 'resistanceDebuff',
  DamageDebuff: 'damageDebuff',
};

/**
 * Synthesize a PowerEffects fragment from a pseudo-pet's enhanceable debuffs so
 * the parent summon power can surface them in its Power Effects block — scaled
 * by the summoner's enhancements (pseudo-pets inherit them via CopyBoosts).
 *
 * Mirrors the pseudo-pet DAMAGE unify: only NON-commandable entities (patches /
 * rains / location pseudo-pets) qualify; commandable pets (MM henchmen, Phantom
 * Army, Lore) keep their own Summons block. Returns null when there's nothing
 * enhanceable to surface. Same-key effects sum their scale (additive debuffs).
 */
export function synthesizePseudoPetEffects(
  summon: import('@/types/power').SummonEffect | undefined,
): Partial<import('@/types/power').PowerEffects> | null {
  if (!summon) return null;
  const out: Record<string, { scale: number; table: string }> = {};

  const addEnhanceable = (type: string, scale: number | undefined, table: string | undefined) => {
    const key = PSEUDO_PET_ENHANCEABLE_EFFECT[type];
    if (!key || scale === undefined || !table) return;
    if (out[key]) out[key].scale += scale;
    else out[key] = { scale, table };
  };

  // Real PET_ENTITIES-backed pseudo-pets (Glue Arrow's StickyArrow, rains, …).
  const entityNames = summon.entities && summon.entities.length > 0
    ? summon.entities.map((e) => e.entity)
    : summon.entity ? [summon.entity] : [];
  for (const entityName of entityNames) {
    const entity = PET_ENTITIES[entityName];
    if (!entity || entity.commandable) continue; // pseudo-pets / patches only
    for (const ability of entity.abilities) {
      for (const eff of ability.effects ?? []) addEnhanceable(eff.type, eff.scale, eff.table);
    }
  }

  // Synthesized location pseudo-pets (Storm Cell, Category Five, …) — only the
  // ENHANCEABLE debuffs merge into Power Effects (scaled by the summoner's
  // enhancements). IgnoreStrength debuffs are surfaced informationally elsewhere.
  for (const resolved of summon.resolvedEntities ?? []) {
    for (const ability of resolved.abilities) {
      for (const eff of ability.effects ?? []) {
        if (eff.ignoreStrength) continue;
        addEnhanceable(eff.type, eff.scale, eff.table);
      }
    }
  }

  return Object.keys(out).length > 0
    ? (out as Partial<import('@/types/power').PowerEffects>)
    : null;
}
