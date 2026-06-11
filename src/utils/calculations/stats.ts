/**
 * City of Heroes - Character Stats Calculation
 *
 * The empty CharacterStats factory + baseline-health lookup. The pool/active
 * power-bonus calculators, stat-category config, baseline endurance/recovery,
 * and stat formatters that used to live here were a stale parallel system
 * superseded by character-totals.ts — removed in the Phase 3 dead-code sweep
 * (DEAD-3).
 */

import type { ArchetypeId } from '@/types';
import { getArchetype } from '@/data';

export interface CharacterStats {
  // Offense
  damage: number;
  accuracy: number;
  tohit: number;
  recharge: number;
  endrdx: number;

  // Defense (Positional)
  defMelee: number;
  defRanged: number;
  defAoE: number;

  // Defense (Typed - Combined)
  defSL: number;
  defFC: number;
  defEN: number;
  defPsionic: number;
  defToxic: number;

  // Resistance (Combined)
  resSL: number;
  resFC: number;
  resEN: number;
  resPsionic: number;
  resToxic: number;

  // Recovery & HP
  recovery: number;
  regeneration: number;
  maxhp: number;
  maxend: number;

  // Movement
  runspeed: number;
  flyspeed: number;
  jumpspeed: number;
  jumpheight: number;

  // Debuff Resistance
  debuffResistSlow: number;
  debuffResistDefense: number;
  debuffResistRecharge: number;
  debuffResistEndurance: number;
  debuffResistRecovery: number;
  debuffResistToHit: number;
  debuffResistRegeneration: number;
  debuffResistPerception: number;
}

/**
 * Create empty character stats object
 */
export function createEmptyStats(): CharacterStats {
  return {
    damage: 0,
    accuracy: 0,
    tohit: 0,
    recharge: 0,
    endrdx: 0,
    defMelee: 0,
    defRanged: 0,
    defAoE: 0,
    defSL: 0,
    defFC: 0,
    defEN: 0,
    defPsionic: 0,
    defToxic: 0,
    resSL: 0,
    resFC: 0,
    resEN: 0,
    resPsionic: 0,
    resToxic: 0,
    recovery: 0,
    regeneration: 0,
    maxhp: 0,
    maxend: 0,
    runspeed: 0,
    flyspeed: 0,
    jumpspeed: 0,
    jumpheight: 0,
    debuffResistSlow: 0,
    debuffResistDefense: 0,
    debuffResistRecharge: 0,
    debuffResistEndurance: 0,
    debuffResistRecovery: 0,
    debuffResistToHit: 0,
    debuffResistRegeneration: 0,
    debuffResistPerception: 0,
  };
}

export interface BaselineHealth {
  baseHealth: number;
  maxHealth: number;
}

/**
 * Get baseline health for current archetype and level.
 * Uses per-level HP lookup tables from the raw game data (attrib_max / attrib_max_max).
 */
export function getBaselineHealth(
  archetypeId: ArchetypeId | undefined,
  level: number
): BaselineHealth {
  if (!archetypeId) {
    return { baseHealth: 1204.7588, maxHealth: 2088.2485 };
  }

  const archetype = getArchetype(archetypeId);
  if (!archetype) {
    return { baseHealth: 1204.7588, maxHealth: 2088.2485 };
  }

  const stats = archetype.stats;
  const hpTable = stats?.hpTable;
  const hpCapTable = stats?.hpCapTable;

  // Clamp level to 1-50 range, convert to 0-indexed
  const idx = Math.max(0, Math.min(49, level - 1));

  if (hpTable && hpCapTable && hpTable.length > idx && hpCapTable.length > idx) {
    return {
      baseHealth: hpTable[idx],
      maxHealth: hpCapTable[idx],
    };
  }

  // Fallback to level 50 scalar values if tables are missing
  return {
    baseHealth: stats?.baseHP || 1204.7588,
    maxHealth: stats?.maxHP || 2088.2485,
  };
}
