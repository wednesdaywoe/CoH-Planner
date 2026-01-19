/**
 * Powerset data and accessor functions
 * Migrated from legacy/js/data/powersets/
 *
 * The raw powerset data is imported from a separate file due to its size (~344 files).
 * This module provides typed accessors and utility functions.
 */

import type {
  Powerset,
  Power,
  IOSetCategory,
  EnhancementStatType,
  PowerType,
  DamageType,
  TargetType,
  EffectArea,
  DefenseByType,
  ResistanceByType,
  HealingEffect,
  DebuffResistance,
} from '@/types';
import { POWERSETS_RAW } from './powersets-raw';
import { resolvePath } from '@/utils/paths';

// ============================================
// POWERSET REGISTRY TYPE
// ============================================

export type PowersetRegistry = Record<string, Powerset>;

// ============================================
// RAW DATA TYPES (for conversion)
// ============================================

interface LegacyDamageEffect {
  type: string;
  scale: number;
  table?: string;
}

interface LegacyMultiDamageEffect {
  types: LegacyDamageEffect[];
  scale: number;
}

interface LegacyDotEffect {
  type: string;
  scale: number;
  ticks: number;
}

interface LegacyHealingEffect {
  scale: number;
  perTarget?: boolean;
}

interface LegacyPowerEffects {
  accuracy?: number;
  range?: number;
  recharge?: number;
  endurance?: number;
  cast?: number;
  activationTime?: number;
  damage?: LegacyDamageEffect | LegacyMultiDamageEffect;
  dotDamage?: LegacyDotEffect;
  buffDuration?: number;
  // Buffs
  tohitBuff?: number;
  damageBuff?: number;
  defenseBuff?: number;
  // Debuffs
  tohitDebuff?: number;
  defenseDebuff?: number;
  resistanceDebuff?: number;
  // Defense & Resistance (armor sets)
  defense?: Record<string, number>;
  resistance?: Record<string, number>;
  debuffResistance?: Record<string, number>;
  // Healing
  healing?: LegacyHealingEffect;
  // Mez effects
  stun?: number;
  stunDuration?: number;
  hold?: number;
  holdDuration?: number;
  immobilize?: number;
  immobilizeDuration?: number;
  sleep?: number;
  sleepDuration?: number;
  fear?: number;
  fearDuration?: number;
  confuse?: number;
  confuseDuration?: number;
  knockback?: number;
  knockbackDuration?: number;
  // Mez protection
  protection?: Record<string, number>;
  // Movement
  runSpeed?: { scale: number; table?: string };
  jumpHeight?: { scale: number; table?: string };
  jumpSpeed?: { scale: number; table?: string };
  effectArea?: string;
  radius?: number;
  [key: string]: unknown;
}

interface LegacyPower {
  name: string;
  fullName?: string;
  rank?: number;
  tier?: number;
  available: number;
  description: string;
  shortHelp?: string;
  icon: string;
  powerType: string;
  requires?: string;
  targetType?: string;
  effectArea?: string;
  maxTargets?: number;
  arc?: number;
  maxSlots: number;
  allowedEnhancements: string[];
  allowedSetCategories: string[];
  effects: LegacyPowerEffects;
}

interface LegacyPowerset {
  id?: string;
  name: string;
  displayName?: string;
  category?: string;
  description: string;
  icon: string;
  requires?: string;
  powers: LegacyPower[];
}

type LegacyPowersetRegistry = Record<string, LegacyPowerset>;

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Transform legacy power to typed Power
 */
function transformPower(legacy: LegacyPower): Power {
  const effects = legacy.effects || {};

  return {
    name: legacy.name,
    available: legacy.available,
    maxSlots: legacy.maxSlots,
    allowedEnhancements: legacy.allowedEnhancements as EnhancementStatType[],
    allowedSetCategories: legacy.allowedSetCategories as IOSetCategory[],
    description: legacy.description,
    powerType: legacy.powerType as PowerType,
    effects: {
      // Base stats
      accuracy: effects.accuracy,
      range: effects.range,
      recharge: effects.recharge,
      enduranceCost: effects.endurance,
      castTime: effects.cast || effects.activationTime,
      radius: effects.radius,

      // Damage
      damage: effects.damage
        ? 'type' in effects.damage
          ? {
              type: effects.damage.type as DamageType,
              scale: effects.damage.scale,
            }
          : {
              types: (effects.damage as LegacyMultiDamageEffect).types.map((t) => ({
                type: t.type as DamageType,
                scale: t.scale,
              })),
              scale: (effects.damage as LegacyMultiDamageEffect).scale,
            }
        : undefined,
      dot: effects.dotDamage
        ? {
            type: effects.dotDamage.type as DamageType,
            scale: effects.dotDamage.scale,
            ticks: effects.dotDamage.ticks,
          }
        : undefined,

      // Buff duration
      buffDuration: effects.buffDuration,

      // Buffs
      tohitBuff: effects.tohitBuff,
      damageBuff: effects.damageBuff,
      defenseBuff: effects.defenseBuff,

      // Debuffs
      tohitDebuff: effects.tohitDebuff,
      defenseDebuff: effects.defenseDebuff,
      resistanceDebuff: effects.resistanceDebuff,

      // Defense & Resistance (armor sets)
      defense: effects.defense as DefenseByType | undefined,
      resistance: effects.resistance as ResistanceByType | undefined,
      debuffResistance: effects.debuffResistance as DebuffResistance | undefined,

      // Healing
      healing: effects.healing as HealingEffect | undefined,

      // Mez effects (control powers)
      stun: effects.stun,
      stunDuration: effects.stunDuration,
      hold: effects.hold,
      holdDuration: effects.holdDuration,
      immobilize: effects.immobilize,
      immobilizeDuration: effects.immobilizeDuration,
      sleep: effects.sleep,
      sleepDuration: effects.sleepDuration,
      fear: effects.fear,
      fearDuration: effects.fearDuration,
      confuse: effects.confuse,
      confuseDuration: effects.confuseDuration,
      knockback: effects.knockback,
      knockbackDuration: effects.knockbackDuration,

      // Mez protection (armor powers)
      protection: effects.protection
        ? {
            stun: effects.protection.stun,
            hold: effects.protection.hold,
            immobilize: effects.protection.immobilize,
            sleep: effects.protection.sleep,
            confuse: effects.protection.confuse,
            fear: effects.protection.fear,
            knockback: effects.protection.knockback,
          }
        : undefined,
    },
    // Extended properties from legacy format
    shortHelp: legacy.shortHelp,
    icon: legacy.icon,
    targetType: legacy.targetType as TargetType | undefined,
    effectArea: legacy.effectArea as EffectArea | undefined,
    maxTargets: legacy.maxTargets,
    requires: legacy.requires,
  };
}

/**
 * Transform legacy powerset to typed Powerset
 */
function transformPowerset(id: string, legacy: LegacyPowerset): Powerset {
  return {
    id,
    name: legacy.name,
    description: legacy.description,
    icon: legacy.icon,
    powers: legacy.powers.map(transformPower),
  };
}

/**
 * Transform entire registry
 */
function transformRegistry(legacy: LegacyPowersetRegistry): PowersetRegistry {
  const registry: PowersetRegistry = {};
  for (const [id, powerset] of Object.entries(legacy)) {
    registry[id] = transformPowerset(id, powerset);
  }
  return registry;
}

// ============================================
// POWERSET REGISTRY
// ============================================

// Transform and cache the raw data at module load time
const _powersets: PowersetRegistry = transformRegistry(
  POWERSETS_RAW as unknown as LegacyPowersetRegistry
);

/**
 * Get all powersets
 */
export function getAllPowersets(): PowersetRegistry {
  return _powersets;
}

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get a powerset by ID (e.g., "blaster/fire-blast")
 */
export function getPowerset(id: string): Powerset | undefined {
  return _powersets[id];
}

/**
 * Get all powersets for an archetype category (e.g., "blaster")
 */
export function getPowersetsForArchetype(archetypeId: string): Powerset[] {
  const prefix = `${archetypeId}/`;
  return Object.entries(_powersets)
    .filter(([id]) => id.startsWith(prefix))
    .map(([, powerset]) => powerset);
}

/**
 * Get a specific power from a powerset
 */
export function getPower(powersetId: string, powerName: string): Power | undefined {
  const powerset = getPowerset(powersetId);
  return powerset?.powers.find((p) => p.name === powerName);
}

/**
 * Get powers available at or before a given level
 * Note: available is 0-indexed (available=0 means level 1)
 */
export function getPowersAvailableAtLevel(powersetId: string, level: number): Power[] {
  const powerset = getPowerset(powersetId);
  if (!powerset) return [];
  return powerset.powers.filter((p) => p.available < level && p.available >= 0);
}

/**
 * Search powersets by name
 */
export function searchPowersets(query: string): Powerset[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(_powersets).filter(
    (ps) =>
      ps.name.toLowerCase().includes(lowerQuery) ||
      ps.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Search powers across all powersets
 */
export function searchPowers(query: string): Array<{ power: Power; powersetId: string }> {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ power: Power; powersetId: string }> = [];

  for (const [id, powerset] of Object.entries(_powersets)) {
    for (const power of powerset.powers) {
      if (
        power.name.toLowerCase().includes(lowerQuery) ||
        power.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ power, powersetId: id });
      }
    }
  }

  return results;
}

/**
 * Get count of powersets by archetype
 */
export function getPowersetCountByArchetype(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const id of Object.keys(_powersets)) {
    const archetype = id.split('/')[0];
    counts[archetype] = (counts[archetype] || 0) + 1;
  }

  return counts;
}

// ============================================
// POWER ICON UTILITIES
// ============================================

/**
 * Convert a raw icon filename to proper CamelCase format
 * e.g., "fireblast_fireblast.png" → "FireBlast_FireBlast.png"
 */
function toCamelCaseIcon(iconFilename: string): string {
  // Split by underscore, capitalize each part, rejoin
  return iconFilename
    .split('_')
    .map(part => {
      // Handle the .png extension
      if (part.endsWith('.png')) {
        const name = part.slice(0, -4);
        return name.charAt(0).toUpperCase() + name.slice(1) + '.png';
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('_');
}

/**
 * Get the full icon path for a power
 * @param powersetName The powerset display name (e.g., "Fire Blast", "Archery")
 * @param iconFilename The raw icon filename from data (e.g., "fireblast_fireblast.png")
 * @returns Full path like "/CoH-Planner/img/Powers/Fire Blast Powers Icons/FireBlast_FireBlast.png"
 */
export function getPowerIconPath(powersetName: string, iconFilename: string | undefined): string {
  if (!iconFilename) {
    return resolvePath('/img/Unknown.png');
  }

  const folderName = `${powersetName} Powers Icons`;
  const camelCaseIcon = toCamelCaseIcon(iconFilename);

  return resolvePath(`/img/Powers/${folderName}/${camelCaseIcon}`);
}

/**
 * Get power icon path from a Power object and its powerset
 */
export function resolvePowerIcon(power: Power, powerset: Powerset): string {
  return getPowerIconPath(powerset.name, power.icon);
}
