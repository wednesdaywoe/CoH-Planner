/**
 * Pet Damage Calculation
 *
 * Calculates DPS for summoned pets/pseudopets using pet class tables.
 * Supports the three-tier display: Base → Enhanced → Final
 */

import { getPetEntity, type PetAbility, type PetEffect, type PetEntity } from '@/data/pet-entities';
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
  /** Computed value at current level (from scale*table or magnitude). For
   *  percentage debuffs this is the fraction (0.07 = -7%); for mez it's the
   *  duration in seconds; for KB/heal/-end it's the raw magnitude/points.
   *  SIGNED for the types in `SIGNED_PET_EFFECTS` — a Dark Servant's −20%
   *  Energy resistance is a vulnerability, and rendering it as +20% would read
   *  as the opposite stat. */
  value?: number;
  /** Mez/knock magnitude (e.g. a mag-3 Stun) — distinct from `value` (duration). */
  magnitude?: number;
  chance?: number;
  /** IgnoreStrength: the player's enhancements/buffs do NOT scale this (informational). */
  ignoreStrength?: boolean;
  /** Mode-gated: only applies while the power is empowered/triggered. */
  conditional?: boolean;
  /** Which sub-types this effect covers — the damage types resisted, the
   *  positions/vectors defended, the mez it protects against. Carried through
   *  from `PetEffect` because they are what makes the number mean anything:
   *  "21%" is not a stat, "21% Smashing/Lethal resistance" is. They are also
   *  the discriminator that keeps two effects of the same type apart (see
   *  `effectKey`). */
  defenseTypes?: string[];
  resistanceTypes?: string[];
  mezTypes?: string[];
  debuffTypes?: string[];
}

/**
 * Effect types whose sign is semantic rather than a storage convention.
 *
 * Damage tables are stored negative and every debuff carries its sign in the
 * LABEL ("-ToHit"), so the general rule is to magnitude the pair. `SelfResistance`
 * is the documented exception: the converter preserves the sign precisely because
 * a negative is a real vulnerability (`scripts/convert-pet-entities.cjs`,
 * `extractSelfBuff`), and ~55 Homecoming entities carry one. The sibling self
 * types can't reach here signed — the converter gates them on `scale > 0` or
 * absolute-values them at extraction.
 */
const SIGNED_PET_EFFECTS = new Set(['SelfResistance']);

/**
 * Identity of one computed effect within a pet's aggregated list.
 *
 * Keying on `type` alone silently drops every effect after the first of its
 * kind, and a pet's defensive profile is exactly where duplicates are the norm:
 * a Soldier carries Mag 4 Placate protection AND Mag 2 Confuse protection, +5%
 * Ranged defense AND +3% AoE defense. Type-only keying kept the first of each
 * pair and discarded the rest with no error anywhere.
 */
function effectKey(type: string, eff: Pick<PetEffectComputed, 'defenseTypes' | 'resistanceTypes' | 'mezTypes' | 'debuffTypes'>): string {
  const sub = [eff.resistanceTypes, eff.defenseTypes, eff.mezTypes, eff.debuffTypes]
    .filter((list): list is string[] => Array.isArray(list) && list.length > 0)
    .map((list) => list.join(','))
    .join('|');
  return sub ? `${type} ${sub}` : type;
}

/** Resolve an effect's scale × table at a level, preserving sign where it means something. */
function computeEffectValue(
  eff: { scale?: number; table?: string; magnitude?: number; type: string },
  tableValue: number | undefined,
): number | undefined {
  if (eff.scale && eff.table) {
    if (tableValue === undefined) return undefined;
    const magnitude = Math.abs(tableValue) * Math.abs(eff.scale);
    return SIGNED_PET_EFFECTS.has(eff.type) && eff.scale < 0 ? -magnitude : magnitude;
  }
  return eff.magnitude;
}

/**
 * The abilities a henchman actually has once the chosen upgrades are applied.
 *
 * A Mastermind upgrade REPLACES; it does not add. Equip Mercenary revokes the
 * Soldier's base Resistance and grants Equip in its place; Enchant Undead
 * revokes the Skeletal Warrior's Hack and Slash and grants its own. Appending
 * the tier — which is what this used to do — left the warrior swinging Hack
 * twice at tier 2 and three times at tier 3, and left the Howler Wolf quoting
 * its un-upgraded 7.5% resistance instead of the upgraded 12%.
 *
 * Two rules, applied in tier order:
 *  - the tier's own `revokes` list, which the game authors on the player power
 *    and the converter joins back onto the pet, and
 *  - same NAME wins: a `_2`/`_3` power with a base power's name IS that power,
 *    upgraded. This one needs no export support, which matters because
 *    Thunderspy's export doesn't resolve grant targets and so carries no
 *    `revokes` at all.
 */
function resolveAbilities(entity: PetEntity, activeTiers: ReadonlySet<number>): PetAbility[] {
  const byName = new Map<string, PetAbility>();
  for (const ability of entity.abilities) byName.set(ability.name, ability);

  for (const tier of entity.upgradeTiers ?? []) {
    if (!activeTiers.has(tier.tier)) continue;
    for (const name of tier.revokes ?? []) byName.delete(name);
    for (const ability of tier.abilities) byName.set(ability.name, ability);
  }

  return [...byName.values()];
}

/** The sub-type lists a `PetEffect` carries, for copying onto its computed twin. */
function subTypes(eff: PetEffect) {
  return {
    defenseTypes: eff.defenseTypes,
    resistanceTypes: eff.resistanceTypes,
    mezTypes: eff.mezTypes,
    debuffTypes: eff.debuffTypes,
  };
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
  /** This pet detonates once and is destroyed (`PetEntity.oneShot`): trip mines,
   *  time bombs, seeker drones, Photon Seekers. Carried through so the per-cast
   *  accounting can cap fires-per-spawn at 1 — its attack's recharge is not a
   *  repeat cadence, because the pet does not survive to use it again. */
  oneShot?: boolean;
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

    // Weight a probabilistic template by its hit chance — the expected damage,
    // matching how the player-power path treats a sub-1.0 damage roll. Trip
    // Mine's third Fire template only lands half the time; counting it in full
    // overstated every mine by ~14%.
    const chance = dmg.chance ?? 1;
    const base = Math.abs(tableValue) * Math.abs(dmg.scale) * chance;
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
 * @param activeUpgradeTiers - Which henchman upgrade tiers are applied, by tier
 *   number as the data names them (2 = the first upgrade's powerset, 3 = the
 *   second's). Empty or omitted = un-upgraded. Tier numbers rather than a count
 *   because a build can hold the second upgrade without the first.
 */
export function calculatePetDamage(
  entityName: string,
  level: number = 50,
  entityCount: number = 1,
  duration?: number,
  enhancementBonus: number = 0,
  applyEnhancements: boolean = false,
  globalDamageBonus: number = 0,
  activeUpgradeTiers: Iterable<number> = []
): PetDamageResult | null {
  const entity = getPetEntity(entityName);
  if (!entity) return null;

  const allAbilities = resolveAbilities(entity, new Set(activeUpgradeTiers));

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
        const sub = subTypes(eff);
        const key = effectKey(eff.type, sub);
        if (allEffectsMap.has(key)) continue;
        const tableValue = eff.table
          ? getPetTableValue(entity.characterClass, eff.table, level)
          : undefined;
        allEffectsMap.set(key, {
          type: eff.type,
          value: computeEffectValue(eff, tableValue),
          magnitude: eff.magnitude,
          chance: eff.chance,
          ...sub,
        });
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
    oneShot: entity.oneShot,
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
  /** "Storm Cell Active" / High Winds on: swap Tempest→WindSpeed effects, fold the
   *  mode-gated lightning into the DPS total, and show its effects as active. */
  poweredUp: boolean = false,
): PetDamageResult | null {
  if (!entity?.abilities?.length) return null;

  const isPvPTable = (table?: string) => table?.toLowerCase().includes('pvp') ?? false;
  const isInherentDamageTable = (table?: string) => table?.toLowerCase().includes('inherentdamage') ?? false;

  const abilities: PetAbilityDamage[] = [];
  const effectOnlyAbilities: PetAbility[] = [];
  const allEffectsMap = new Map<string, PetEffectComputed>();
  let totalDpsBase = 0, totalDpsEnhanced = 0, totalDpsFinal = 0;

  const enhMult = applyEnhancements ? 1 + enhancementBonus : 1;
  const buffMult = 1 + globalDamageBonus;

  for (const ability of entity.abilities) {
    // When powered up, the empowered (WindSpeed) effects replace the base set,
    // and mode-gated content is no longer conditional (it's active).
    const effSource = (poweredUp && ability.poweredUpEffects) ? ability.poweredUpEffects : ability.effects;
    if (effSource) {
      for (const eff of effSource) {
        // Synthesized pseudo-pets carry no sub-type lists (they are built from a
        // redirect's own templates, not a villain def), so the key degrades to
        // the bare type — same behaviour as before for this path.
        if (allEffectsMap.has(eff.type)) continue;
        const tv = eff.table ? getTableValue(archetype, eff.table, level) : undefined;
        allEffectsMap.set(eff.type, {
          type: eff.type,
          value: computeEffectValue(eff, tv),
          magnitude: eff.magnitude,
          chance: eff.chance,
          ignoreStrength: eff.ignoreStrength,
          conditional: poweredUp ? false : eff.conditional,
        });
      }
    }

    // Conditional (storm-strength gated / proc) damage is NOT guaranteed — keep
    // it out of the DPS/headline total and surface it as an informational effect
    // (per-tick value + chance). Mirrors how the game shows Storm Cell's lightning
    // as "chance for X / while powered up" rather than a flat DoT.
    // Mode-gated damage (Storm Cell lightning) is conditional UNLESS powered up.
    // Powered up → it folds into the DPS total (handled below); otherwise it's
    // surfaced as an informational "<type> Dmg" effect (per-tick value + chance).
    if (ability.conditionalDamage && !poweredUp && ability.damage.length > 0) {
      for (const dmg of ability.damage) {
        const key = `${dmg.damageType} Dmg`;
        if (allEffectsMap.has(key)) continue;
        const tv = getTableValue(archetype, dmg.table, level);
        allEffectsMap.set(key, {
          type: key,
          value: tv !== undefined ? Math.abs(tv) * Math.abs(dmg.scale) : undefined,
          chance: ability.damageChance && ability.damageChance > 0 ? ability.damageChance : undefined,
          // chance===0 mode-gated damage is conditional (e.g. Storm Cell lightning
          // "while High Winds active"); a real proc (chance>0) is not.
          conditional: !ability.damageChance,
        });
      }
      if (!effSource || effSource.length === 0) continue;
    }

    if (!ability.damage || ability.damage.length === 0 || (ability.conditionalDamage && !poweredUp)) {
      // No guaranteed damage to contribute to DPS — but it may still carry
      // (already-collected) debuffs/mez, so it's an effect-only ability here.
      effectOnlyAbilities.push(ability as unknown as PetAbility);
      continue;
    }

    // Proc damage (0 < damageChance < 1) counts at its EXPECTED value
    // (chance × per-hit) — the planner's proc convention. Guaranteed DoT has no
    // damageChance ⇒ multiplier 1. Powered-up mode-gated damage (the lightning)
    // counts at full (it's active, not a proc).
    const chanceMult = (poweredUp && ability.conditionalDamage) ? 1 : (ability.damageChance ?? 1);
    // Powered up: escalate to the Strong lightning (StormCell_LightningAura, 1.0 ≈
    // 2× the base 0.5 aura) when a poweredUpDamage variant is present — the
    // high-storm-strength swap, mirroring the Tempest→WindSpeed effect swap.
    const damageSource = (poweredUp && ability.poweredUpDamage && ability.poweredUpDamage.length > 0)
      ? ability.poweredUpDamage
      : ability.damage;
    // Keep pseudo-pet runtime damage aligned with the main power damage path:
    // skip PvP table variants and ignore InherentDamage bonus entries when a
    // regular sibling exists (avoid double-counting after AT table expansion).
    let damageEntries = damageSource.filter((dmg) => !isPvPTable(dmg.table) && !isInherentDamageTable(dmg.table));
    if (damageEntries.length === 0) {
      damageEntries = damageSource.filter((dmg) => !isPvPTable(dmg.table));
    }

    const baseDamages: { type: string; base: number }[] = [];
    for (const dmg of damageEntries) {
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
  const entity = getPetEntity(entityName);
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

// PetEffect.type → PowerEffects mez key. These carry magnitude + duration
// (scale × table), so they hoist as a MezEffect { mag, scale, table } — the same
// shape a directly-applied control effect uses. That lets the Power Effects block
// render the control (Mag N, duration) and scale the duration by the summoner's
// mez enhancements (pseudo-pets inherit them via CopyBoosts). Location AoE holds
// (Shadow Field, Volcanic Gasses, …) apply ALL their control through the summon,
// so this is the only place a player would otherwise see it in Power Effects.
const PSEUDO_PET_MEZ_EFFECT: Record<string, keyof import('@/types/power').PowerEffects> = {
  Hold: 'hold',
  Stun: 'stun',
  Sleep: 'sleep',
  Fear: 'fear',
  Confuse: 'confuse',
  Immobilize: 'immobilize',
};

/**
 * Synthesize a PowerEffects fragment from a pseudo-pet's enhanceable debuffs so
 * the parent summon power can surface them in its Power Effects block — scaled
 * by the summoner's enhancements (pseudo-pets inherit them via CopyBoosts).
 *
 * Mirrors the pseudo-pet DAMAGE unify: only NON-commandable entities (patches /
 * rains / location pseudo-pets) qualify; commandable pets (MM henchmen, Phantom
 * Army, Lore) keep their own Summons block. Returns null when there's nothing to
 * surface. Additive debuffs sum their scale on a key collision; mez instead keeps
 * the single strongest instance (control doesn't stack into one bigger number).
 */
export function synthesizePseudoPetEffects(
  summon: import('@/types/power').SummonEffect | undefined,
): Partial<import('@/types/power').PowerEffects> | null {
  if (!summon) return null;
  const out: Record<string, { scale: number; table: string }> = {};
  const outMez: Record<string, { mag: number; scale: number; table: string }> = {};

  const addEnhanceable = (type: string, scale: number | undefined, table: string | undefined) => {
    const key = PSEUDO_PET_ENHANCEABLE_EFFECT[type];
    if (!key || scale === undefined || !table) return;
    if (out[key]) out[key].scale += scale;
    else out[key] = { scale, table };
  };

  const addMez = (
    type: string,
    mag: number | undefined,
    scale: number | undefined,
    table: string | undefined,
    chance: number | undefined,
  ) => {
    const key = PSEUDO_PET_MEZ_EFFECT[type];
    if (!key || mag === undefined || scale === undefined || !table) return;
    // Only surface reliably-applied control. A low-chance mez (e.g. Shadow
    // Field's 5% aura hold proc) would read as a guaranteed Hold here; those stay
    // in the Summons block where their chance is shown alongside.
    if (chance !== undefined && chance < 1) return;
    // Mez doesn't sum like additive debuffs — keep the single strongest instance:
    // higher magnitude wins, then longer duration (scale is a table-agnostic
    // proxy; the true duration is computed against the AT table at display time).
    const prev = outMez[key];
    if (!prev || mag > prev.mag || (mag === prev.mag && scale > prev.scale)) {
      outMez[key] = { mag, scale, table };
    }
  };

  // Real PET_ENTITIES-backed pseudo-pets (Glue Arrow's StickyArrow, rains,
  // Shadow Field's Pets_Shadow_Field_Controller, …).
  const entityNames = summon.entities && summon.entities.length > 0
    ? summon.entities.map((e) => e.entity)
    : summon.entity ? [summon.entity] : [];
  for (const entityName of entityNames) {
    const entity = getPetEntity(entityName);
    if (!entity || entity.commandable) continue; // pseudo-pets / patches only
    for (const ability of entity.abilities) {
      for (const eff of ability.effects ?? []) {
        addEnhanceable(eff.type, eff.scale, eff.table);
        addMez(eff.type, eff.magnitude, eff.scale, eff.table, eff.chance);
      }
    }
  }

  // Synthesized location pseudo-pets (Storm Cell, Category Five, …) — only the
  // ENHANCEABLE debuffs / control merge into Power Effects (scaled by the
  // summoner's enhancements). IgnoreStrength effects are surfaced informationally
  // elsewhere.
  for (const resolved of summon.resolvedEntities ?? []) {
    for (const ability of resolved.abilities) {
      for (const eff of ability.effects ?? []) {
        if (eff.ignoreStrength) continue;
        addEnhanceable(eff.type, eff.scale, eff.table);
        addMez(eff.type, eff.magnitude, eff.scale, eff.table, eff.chance);
      }
    }
  }

  const merged = { ...out, ...outMez };
  return Object.keys(merged).length > 0
    ? (merged as Partial<import('@/types/power').PowerEffects>)
    : null;
}

/**
 * Widest AoE footprint (radius + arc) carried by a power's summoned
 * pseudo-pet / ground patch. Many AoE powers have radius 0 on the parent power
 * because the real area of effect lives on a summon: Burn (Self/SingleTarget
 * shell + PL_StaticObject pseudo-pet, radius 15) or the rains / Caltrops /
 * Tar Patch (Location parent + a real PET_ENTITIES patch like Pets_RainofFire,
 * radius 25). The PPM proc area-factor must use that footprint, otherwise these
 * are scored as single-target and their proc chance is reported far too high.
 *
 * Mirrors synthesizePseudoPetEffects' dual iteration: real non-commandable
 * PET_ENTITIES patches plus inline resolvedEntities. Commandable pets
 * (Mastermind henchmen, Lore) are excluded — procs slotted in the SUMMON power
 * don't roll against the pet's own attacks. Pet self-buffs (no radius) are
 * skipped. Arc defaults to 360 (sphere/patch): the bin format stores no arc on
 * pseudo-pet abilities and effectively all of these footprints are spheres.
 *
 * Returns null when the summon has no AoE footprint.
 */
export function getPseudoPetAoEGeometry(
  summon: import('@/types/power').SummonEffect | undefined,
): { radius: number; arcDegrees: number } | null {
  if (!summon) return null;
  let bestRadius = 0;
  const consider = (radius: number | undefined, effectArea: string | undefined) => {
    if (!radius || radius <= 0) return;
    if (effectArea === 'SingleTarget' || effectArea === 'Self') return;
    if (radius > bestRadius) bestRadius = radius;
  };

  const entityNames = summon.entities && summon.entities.length > 0
    ? summon.entities.map((e) => e.entity)
    : summon.entity ? [summon.entity] : [];
  for (const entityName of entityNames) {
    const entity = getPetEntity(entityName);
    if (!entity || entity.commandable) continue; // patches / pseudo-pets only
    for (const ability of entity.abilities) consider(ability.radius, ability.effectArea);
  }
  for (const resolved of summon.resolvedEntities ?? []) {
    for (const ability of resolved.abilities) consider(ability.radius, ability.effectArea);
  }

  return bestRadius > 0 ? { radius: bestRadius, arcDegrees: 360 } : null;
}

/**
 * Radius + arc the PPM proc area-factor should use for a power: its own AoE
 * when it has one, else the summoned pseudo-pet / patch footprint (Burn, rains,
 * Caltrops…), else single-target (radius 0).
 *
 * @param directRadius the parent power's own AoE radius (0 if none)
 * @param directArcDegrees the parent power's arc IN DEGREES (caller converts
 *   from the raw binary radians); ignored when directRadius is 0
 */
export function resolveProcAreaGeometry(
  directRadius: number,
  directArcDegrees: number | undefined,
  summon: import('@/types/power').SummonEffect | undefined,
): { radius: number; arcDegrees: number } {
  if (directRadius > 0) {
    return {
      radius: directRadius,
      arcDegrees: directArcDegrees && directArcDegrees > 0 ? directArcDegrees : 360,
    };
  }
  return getPseudoPetAoEGeometry(summon) ?? { radius: 0, arcDegrees: 360 };
}
