/**
 * Pet Damage Calculation
 *
 * Calculates DPS for summoned pets/pseudopets using pet class tables.
 * Supports the three-tier display: Base → Enhanced → Final
 */

import { PET_ENTITIES, type PetAbility } from '@/data/pet-entities';
import { getPetTableValue } from '@/data/at-tables';

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
