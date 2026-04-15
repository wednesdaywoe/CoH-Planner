/**
 * Build Store - manages character build state
 *
 * Uses Zustand for state management with persistence to localStorage.
 * This replaces the legacy global AppState.build object.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Build,
  SelectedPower,
  Accolade,
  ArchetypeId,
  ArchetypeBranchId,
  Origin,
  ProgressionMode,
  Enhancement,
  SelectedIncarnatePower,
  IncarnateSlotId,
  CraftingChecklistKey,
} from '@/types';
import { createEmptyBuild, createEmptyIncarnateBuildState, createEmptyCraftingChecklistState } from '@/types';
import {
  getArchetype,
  getPowerset,
  getPowerPool,
  getEpicPool,
  getTotalSlotsAtLevel,
  MAX_POWER_POOLS,
  MAX_POWER_PICKS,
  EPIC_POOL_LEVEL,
  POOL_UNLOCK_LEVEL,
  getInherentPowers,
  getInherentPowerDef,
  getArchetypeInherentPowers,
  createArchetypeInherentPower,
  POWER_PICK_LEVELS,
  getIOSet,
  GRANTED_POWER_GROUPS,
  getExcludedPools,
  getAllPowerPools,
} from '@/data';
import type { InherentPowerDef } from '@/data';
import { computeSetTracking } from '@/utils/calculations/set-tracking';
import { slimBuild, hydrateBuild } from '@/utils/build-serialization';
import { useHistoryStore } from './historyStore';
import { useUIStore } from './uiStore';

// ============================================
// POWER CATEGORY TYPE
// ============================================

export type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic' | 'inherent';

// ============================================
// BUILD STORE INTERFACE
// ============================================

interface BuildState {
  /** The current build */
  build: Build;

  /** Whether the store has been hydrated from storage */
  _hasHydrated: boolean;
}

interface BuildActions {
  // Build metadata
  setBuildName: (name: string) => void;

  // Archetype
  setArchetype: (archetypeId: ArchetypeId) => void;
  clearArchetype: () => void;

  // Powersets
  setPrimary: (powersetId: string) => void;
  setSecondary: (powersetId: string) => void;

  // Powers
  addPower: (category: PowerCategory, power: SelectedPower) => void;
  removePower: (category: PowerCategory, powerName: string) => void;
  movePowerLevel: (category: PowerCategory, powerName: string, newLevel: number) => void;
  swapPowerLevels: (powerNameA: string, powerNameB: string) => void;

  // Pools
  addPool: (poolId: string) => boolean;
  removePool: (poolId: string) => void;
  setEpicPool: (poolId: string | null) => void;

  // Slots (category is optional — disambiguates when multiple powers share the same internalName)
  addSlot: (powerName: string, category?: PowerCategory) => boolean;
  removeSlot: (powerName: string, slotIndex: number, category?: PowerCategory) => boolean;
  clearSlotOrder: () => void;

  // Enhancements
  setEnhancement: (powerName: string, slotIndex: number, enhancement: Enhancement, category?: PowerCategory) => void;
  clearEnhancement: (powerName: string, slotIndex: number, category?: PowerCategory) => void;
  clearAllEnhancements: (powerName: string, category?: PowerCategory) => void;

  // Settings
  setLevel: (level: number) => void;
  setExemplarLevel: (level: number | null) => void;
  setProgressionMode: (mode: ProgressionMode) => void;
  setOrigin: (origin: Origin) => void;
  setGlobalIOLevel: (level: number) => void;

  // Accolades
  addAccolade: (accolade: Accolade) => void;
  removeAccolade: (accoladeId: string) => void;

  // Incarnates
  setIncarnatePower: (slotId: IncarnateSlotId, power: SelectedIncarnatePower) => void;
  clearIncarnatePower: (slotId: IncarnateSlotId) => void;
  clearAllIncarnates: () => void;

  // Incarnate Crafting Checklist
  toggleCraftingCheckItem: (key: CraftingChecklistKey) => void;
  setCraftingCheckItem: (key: CraftingChecklistKey, checked: boolean) => void;
  clearCraftingChecklist: () => void;
  clearCraftingChecklistForSlot: (slotId: IncarnateSlotId) => void;

  // Shopping List
  acquireShoppingItem: (salvageId: string) => void;
  unacquireShoppingItem: (salvageId: string) => void;
  clearShoppingListAcquired: () => void;

  // Power toggle (for stat calculations)
  togglePowerActive: (powerName: string, category?: PowerCategory) => void;
  /** Set the active sub-power for powers with mutually exclusive stances (e.g., Adaptation) */
  setActiveSubPower: (parentPowerName: string, subPowerName: string | null) => void;

  // Computed
  getTotalSlotsUsed: () => number;
  getSlotsRemaining: () => number;
  getActiveSetBonuses: () => Array<{ setId: string; bonusIndex: number }>;
  canAddSlot: (powerName: string, category?: PowerCategory) => boolean;
  canAddPool: () => boolean;
  canSelectEpicPool: () => boolean;
  isUniqueEnhancementSlotted: (setId: string, pieceNum: number) => boolean;
  isPrestigeSlotted: (prestigeId: string) => boolean;

  // Import/Export
  exportBuild: () => string;
  importBuild: (json: string) => boolean;
  importMidsBuild: (build: Build) => void;
  resetBuild: () => void;
  clearPowers: () => void;

  // Hydration
  setHasHydrated: (value: boolean) => void;

  // History (internal - used by undo/redo)
  _restoreBuild: (build: Build) => void;
}

type BuildStore = BuildState & BuildActions;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Sync power definitions (effects, icons) and enhancement icons from current data.
 * Fixes stale data in builds saved before power/enhancement updates.
 * Called on both localStorage rehydration and build import.
 */
function syncBuildDefinitions(build: Build): void {
  // Track old→new internalName changes for slotOrder migration
  const internalNameMigrations = new Map<string, string>();

  // Helper: sync power effects + icons from a powerset definition
  const syncPowers = (powers: SelectedPower[], defPowers: readonly Pick<SelectedPower, 'name' | 'internalName' | 'effects' | 'icon'>[]): SelectedPower[] => {
    let anyChanged = false;
    const synced = powers.map((power) => {
      let currentDef = defPowers.find((p) => p.internalName === power.internalName);
      // Fallback: match by display name if internalName was renamed
      if (!currentDef) {
        currentDef = defPowers.find((p) => p.name === power.name);
      }
      if (!currentDef) return power;
      const needsInternalName = currentDef.internalName !== power.internalName;
      const needsEffects = currentDef.effects && currentDef.effects !== power.effects;
      const needsIcon = currentDef.icon && currentDef.icon !== power.icon;
      if (needsInternalName || needsEffects || needsIcon) {
        anyChanged = true;
        if (needsInternalName) {
          internalNameMigrations.set(power.internalName, currentDef.internalName);
        }
        return {
          ...power,
          ...(needsInternalName ? { internalName: currentDef.internalName } : {}),
          ...(needsEffects ? { effects: currentDef.effects } : {}),
          ...(needsIcon ? { icon: currentDef.icon } : {}),
        };
      }
      return power;
    });
    return anyChanged ? synced : powers;
  };

  // For VEATs, collect branch power definitions so sync covers branch powers too
  const archetype = build.archetype.id ? getArchetype(build.archetype.id) : null;

  // Helper: fix powerSet to use the correct powerset ID.
  // For VEATs with branches, a power's powerSet may legitimately be a branch set ID
  // (e.g., 'arachnos-widow/fortunata-training') rather than the base primary ID.
  // Also fixes branch powers that were incorrectly assigned the base set ID
  // (e.g., from older imports that didn't distinguish branch powersets).
  const fixPowerSetIds = (powers: SelectedPower[], correctId: string, role?: 'primary' | 'secondary'): SelectedPower[] => {
    // Collect all valid powerset IDs: base + branch sets
    const validIds = new Set([correctId]);
    // Build branch set map for correcting misassigned powers
    const branchSets: Array<{ id: string; powerNames: Set<string> }> = [];
    if (role && archetype?.branches) {
      for (const branch of Object.values(archetype.branches)) {
        if (!branch) continue;
        const branchSetId = role === 'primary' ? branch.primarySet : branch.secondarySet;
        if (branchSetId) {
          validIds.add(branchSetId);
          const branchPowerset = getPowerset(branchSetId);
          if (branchPowerset) {
            branchSets.push({
              id: branchSetId,
              powerNames: new Set(branchPowerset.powers.map(p => p.internalName)),
            });
          }
        }
      }
    }

    // Check if the base powerset actually contains each power
    const basePowerset = getPowerset(correctId);
    const basePowerNames = basePowerset
      ? new Set(basePowerset.powers.map(p => p.internalName))
      : new Set<string>();

    let anyChanged = false;
    const fixed = powers.map((power) => {
      if (!power.powerSet || !validIds.has(power.powerSet)) {
        // Invalid powerset — assign base
        anyChanged = true;
        return { ...power, powerSet: correctId };
      }
      // Fix branch powers incorrectly assigned to the base powerset:
      // if the power's current powerSet is the base but the power doesn't exist there,
      // find the correct branch powerset
      if (power.powerSet === correctId && !basePowerNames.has(power.internalName)) {
        for (const branch of branchSets) {
          if (branch.powerNames.has(power.internalName)) {
            anyChanged = true;
            return { ...power, powerSet: branch.id };
          }
        }
      }
      return power;
    });
    return anyChanged ? fixed : powers;
  };
  const getBranchPowers = (role: 'primary' | 'secondary'): readonly Pick<SelectedPower, 'name' | 'internalName' | 'effects' | 'icon'>[] => {
    if (!archetype?.branches) return [];
    const powers: Pick<SelectedPower, 'name' | 'internalName' | 'effects' | 'icon'>[] = [];
    for (const branch of Object.values(archetype.branches)) {
      if (!branch) continue;
      const branchSetId = role === 'primary' ? branch.primarySet : branch.secondarySet;
      if (!branchSetId) continue;
      const branchDef = getPowerset(branchSetId);
      if (branchDef) powers.push(...branchDef.powers);
    }
    return powers;
  };

  // Sync primary powers
  if (build.primary.id && build.primary.powers.length > 0) {
    const def = getPowerset(build.primary.id);
    if (def) {
      const allDefs = [...def.powers, ...getBranchPowers('primary')];
      let fixed = syncPowers(build.primary.powers, allDefs);
      fixed = fixPowerSetIds(fixed, build.primary.id, 'primary');
      if (fixed !== build.primary.powers) {
        build.primary = { ...build.primary, powers: fixed };
      }
    }
  }

  // Sync secondary powers
  if (build.secondary.id && build.secondary.powers.length > 0) {
    const def = getPowerset(build.secondary.id);
    if (def) {
      const allDefs = [...def.powers, ...getBranchPowers('secondary')];
      let fixed = syncPowers(build.secondary.powers, allDefs);
      fixed = fixPowerSetIds(fixed, build.secondary.id, 'secondary');
      if (fixed !== build.secondary.powers) {
        build.secondary = { ...build.secondary, powers: fixed };
      }
    }
  }

  // Fix misplaced pool powers — move powers to their correct pool container
  if (build.pools.length > 1) {
    // Build lookup: powerName → correct poolId
    const allPools = getAllPowerPools();
    const powerToPool = new Map<string, string>();
    for (const [poolId, poolDef] of Object.entries(allPools)) {
      for (const p of poolDef.powers) {
        powerToPool.set(p.internalName, poolId);
      }
    }

    // Check for misplaced powers
    let hasMisplaced = false;
    for (const pool of build.pools) {
      for (const power of pool.powers) {
        const correctPoolId = powerToPool.get(power.internalName);
        if (correctPoolId && correctPoolId !== pool.id) {
          hasMisplaced = true;
          break;
        }
      }
      if (hasMisplaced) break;
    }

    if (hasMisplaced) {
      // Collect all pool powers, then redistribute to correct containers
      const poolIds = build.pools.map((p) => p.id);
      const poolPowers = new Map<string, SelectedPower[]>(poolIds.map((id) => [id, []]));

      for (const pool of build.pools) {
        for (const power of pool.powers) {
          const correctPoolId = powerToPool.get(power.internalName);
          const targetId = correctPoolId && poolIds.includes(correctPoolId) ? correctPoolId : pool.id;
          poolPowers.get(targetId)!.push({ ...power, powerSet: targetId });
        }
      }

      build.pools = build.pools.map((pool) => ({
        ...pool,
        powers: poolPowers.get(pool.id) ?? pool.powers,
      }));
    }
  }

  // Sync pool powers
  if (build.pools.length > 0) {
    build.pools = build.pools.map((pool) => {
      const def = getPowerPool(pool.id);
      if (!def) return pool;
      let fixed = syncPowers(pool.powers, def.powers);
      fixed = fixPowerSetIds(fixed, pool.id);
      return fixed !== pool.powers ? { ...pool, powers: fixed } : pool;
    });
  }

  // Sync epic pool powers
  if (build.epicPool && build.epicPool.powers.length > 0) {
    const def = getEpicPool(build.epicPool.id);
    if (def) {
      let fixed = syncPowers(build.epicPool.powers, def.powers);
      fixed = fixPowerSetIds(fixed, build.epicPool.id);
      if (fixed !== build.epicPool.powers) {
        build.epicPool = { ...build.epicPool, powers: fixed };
      }
    }
  }

  // Sync inherent power icons (handles PascalCase -> lowercase migration)
  if (build.inherents.length > 0) {
    const fixed = syncPowers(build.inherents, getInherentPowers());
    if (fixed !== build.inherents) {
      build.inherents = fixed;
    }
  }

  // Fix IO set enhancement icons from current data
  const fixEnhancementIcons = (powers: SelectedPower[]) => {
    let anyChanged = false;
    const fixed = powers.map((power) => {
      let powerChanged = false;
      const slots = power.slots.map((slot) => {
        if (slot && slot.type === 'io-set') {
          const enh = slot as Enhancement & { setId?: string; icon?: string };
          const ioSet = enh.setId ? getIOSet(enh.setId) : null;
          if (ioSet?.icon && enh.icon !== ioSet.icon) {
            powerChanged = true;
            return { ...enh, icon: ioSet.icon };
          }
        }
        return slot;
      });
      if (powerChanged) {
        anyChanged = true;
        return { ...power, slots };
      }
      return power;
    });
    return anyChanged ? fixed : powers;
  };

  if (build.primary.powers.length > 0) {
    const fixed = fixEnhancementIcons(build.primary.powers);
    if (fixed !== build.primary.powers) {
      build.primary = { ...build.primary, powers: fixed };
    }
  }
  if (build.secondary.powers.length > 0) {
    const fixed = fixEnhancementIcons(build.secondary.powers);
    if (fixed !== build.secondary.powers) {
      build.secondary = { ...build.secondary, powers: fixed };
    }
  }
  if (build.pools.length > 0) {
    build.pools = build.pools.map((pool) => {
      const fixed = fixEnhancementIcons(pool.powers);
      return fixed !== pool.powers ? { ...pool, powers: fixed } : pool;
    });
  }
  if (build.epicPool && build.epicPool.powers.length > 0) {
    const fixed = fixEnhancementIcons(build.epicPool.powers);
    if (fixed !== build.epicPool.powers) {
      build.epicPool = { ...build.epicPool, powers: fixed };
    }
  }
  if (build.inherents && build.inherents.length > 0) {
    const fixed = fixEnhancementIcons(build.inherents);
    if (fixed !== build.inherents) {
      build.inherents = fixed;
    }
  }

  // Migrate slotOrder entries that reference old internalNames
  if (internalNameMigrations.size > 0 && build.slotOrder) {
    for (const entry of build.slotOrder) {
      const newName = internalNameMigrations.get(entry.powerName);
      if (newName) entry.powerName = newName;
    }
  }
}

/**
 * Find a power across all categories.
 * When `categoryHint` is provided, searches that category first to avoid
 * collisions when multiple powers share the same internalName.
 */
function findPower(
  build: Build,
  powerName: string,
  categoryHint?: PowerCategory
): { power: SelectedPower; category: PowerCategory } | null {
  // If a category hint is provided, check that category first
  if (categoryHint) {
    const hinted = findPowerInCategory(build, powerName, categoryHint);
    if (hinted) return hinted;
  }

  // Fall through to standard search order
  if (categoryHint !== 'primary') {
    const primaryPower = build.primary.powers.find((p) => p.internalName === powerName);
    if (primaryPower) return { power: primaryPower, category: 'primary' };
  }

  if (categoryHint !== 'secondary') {
    const secondaryPower = build.secondary.powers.find((p) => p.internalName === powerName);
    if (secondaryPower) return { power: secondaryPower, category: 'secondary' };
  }

  if (categoryHint !== 'pool') {
    for (const pool of build.pools) {
      const poolPower = pool.powers.find((p) => p.internalName === powerName);
      if (poolPower) return { power: poolPower, category: 'pool' };
    }
  }

  if (categoryHint !== 'epic') {
    if (build.epicPool) {
      const epicPower = build.epicPool.powers.find((p) => p.internalName === powerName);
      if (epicPower) return { power: epicPower, category: 'epic' };
    }
  }

  if (categoryHint !== 'inherent') {
    const inherentPower = build.inherents.find((p) => p.internalName === powerName);
    if (inherentPower) return { power: inherentPower, category: 'inherent' };
  }

  return null;
}

/** Find a power in a specific category only. */
function findPowerInCategory(
  build: Build,
  powerName: string,
  category: PowerCategory
): { power: SelectedPower; category: PowerCategory } | null {
  switch (category) {
    case 'primary': {
      const p = build.primary.powers.find((p) => p.internalName === powerName);
      return p ? { power: p, category: 'primary' } : null;
    }
    case 'secondary': {
      const p = build.secondary.powers.find((p) => p.internalName === powerName);
      return p ? { power: p, category: 'secondary' } : null;
    }
    case 'pool': {
      for (const pool of build.pools) {
        const p = pool.powers.find((p) => p.internalName === powerName);
        if (p) return { power: p, category: 'pool' };
      }
      return null;
    }
    case 'epic': {
      const p = build.epicPool?.powers.find((p) => p.internalName === powerName);
      return p ? { power: p, category: 'epic' } : null;
    }
    case 'inherent': {
      const p = build.inherents.find((p) => p.internalName === powerName);
      return p ? { power: p, category: 'inherent' } : null;
    }
    default:
      return null;
  }
}

/**
 * Count placed (additional) slots that count against the slot budget.
 * Excludes the free first slot on each power.
 * Includes inherent power slots (they count against the budget in-game).
 * Inherents with maxSlots=0 (archetype inherents) have no slots so they contribute 0.
 */
function countPlacedSlots(build: Build): number {
  let total = 0;

  const countExtra = (powers: SelectedPower[]) => {
    for (const power of powers) {
      total += Math.max(0, power.slots.length - 1);
    }
  };

  countExtra(build.primary.powers);
  countExtra(build.secondary.powers);
  for (const pool of build.pools) countExtra(pool.powers);
  if (build.epicPool) countExtra(build.epicPool.powers);
  countExtra(build.inherents);

  return total;
}

/**
 * Get the number of placeable slots available at a given level.
 * This is the total slot grants (67 at level 50).
 * Free first slots from powers are separate and don't count against this budget.
 */
function getPlacedSlotLimit(level: number): number {
  return getTotalSlotsAtLevel(level);
}

/**
 * Count total slots used across all powers (including free and inherent).
 * Used for display purposes, not budget checks.
 */
function countTotalSlots(build: Build): number {
  let total = 0;

  // Primary powers
  for (const power of build.primary.powers) {
    total += power.slots.length;
  }

  // Secondary powers
  for (const power of build.secondary.powers) {
    total += power.slots.length;
  }

  // Pool powers
  for (const pool of build.pools) {
    for (const power of pool.powers) {
      total += power.slots.length;
    }
  }

  // Epic pool powers
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      total += power.slots.length;
    }
  }

  // Inherent powers (some can be slotted)
  for (const power of build.inherents) {
    total += power.slots.length;
  }

  return total;
}

/**
 * Get the counterpart ATO set ID (regular ↔ superior).
 * Returns undefined if the set is not an ATO or has no counterpart.
 */
function getATOCounterpartSetId(setId: string): string | undefined {
  const set = getIOSet(setId);
  if (!set || set.category !== 'ato') return undefined;

  if (setId.startsWith('superior_')) {
    const regularId = setId.slice('superior_'.length);
    const regularSet = getIOSet(regularId);
    return regularSet ? regularId : undefined;
  } else {
    const superiorId = `superior_${setId}`;
    const superiorSet = getIOSet(superiorId);
    return superiorSet ? superiorId : undefined;
  }
}

/**
 * Check if a unique enhancement is already slotted anywhere in the build.
 * Also treats all pieces from purple, event, and archetype (ATO) sets as unique,
 * since the game enforces single-copy rules for these rarities.
 * For ATOs, also checks the counterpart set (regular ↔ superior) since
 * you cannot use both versions of the same ATO in a build.
 * @param build - The current build
 * @param setId - The IO set ID
 * @param pieceNum - The piece number within the set
 * @returns true if the enhancement is already slotted
 */
function isUniqueEnhancementSlotted(build: Build, setId: string, pieceNum: number): boolean {
  // Build the list of set IDs to check: the set itself + its ATO counterpart
  const counterpartId = getATOCounterpartSetId(setId);
  const setIdsToCheck = counterpartId ? [setId, counterpartId] : [setId];

  const checkSlots = (slots: (Enhancement | null)[]): boolean => {
    return slots.some((enh) => {
      if (!enh || enh.type !== 'io-set') return false;
      const ioEnh = enh as { setId: string; pieceNum: number };
      return setIdsToCheck.includes(ioEnh.setId) && ioEnh.pieceNum === pieceNum;
    });
  };

  // Check all power categories
  for (const power of build.primary.powers) {
    if (checkSlots(power.slots)) return true;
  }
  for (const power of build.secondary.powers) {
    if (checkSlots(power.slots)) return true;
  }
  for (const pool of build.pools) {
    for (const power of pool.powers) {
      if (checkSlots(power.slots)) return true;
    }
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      if (checkSlots(power.slots)) return true;
    }
  }
  for (const power of build.inherents) {
    if (checkSlots(power.slots)) return true;
  }

  return false;
}

/**
 * Check if a prestige enhancement is already slotted anywhere in the build.
 * Prestige enhancements are unique per character (max 1 of each).
 */
function isPrestigeEnhancementSlotted(build: Build, prestigeId: string): boolean {
  const checkSlots = (slots: (Enhancement | null)[]): boolean => {
    return slots.some((enh) => {
      if (!enh || enh.type !== 'special') return false;
      return (enh as { category: string; id: string }).category === 'prestige' &&
        (enh as { id: string }).id === prestigeId;
    });
  };

  for (const power of build.primary.powers) {
    if (checkSlots(power.slots)) return true;
  }
  for (const power of build.secondary.powers) {
    if (checkSlots(power.slots)) return true;
  }
  for (const pool of build.pools) {
    for (const power of pool.powers) {
      if (checkSlots(power.slots)) return true;
    }
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) {
      if (checkSlots(power.slots)) return true;
    }
  }
  for (const power of build.inherents) {
    if (checkSlots(power.slots)) return true;
  }
  return false;
}

// Set tracking extracted to src/utils/calculations/set-tracking.ts
const updateSetTracking = computeSetTracking;

/**
 * For VEATs: if build.primary.id or secondary.id is a branch powerset,
 * normalize it back to the base powerset. The planner expects these to
 * always be base powersets, with branch powers stored alongside in the
 * powers array.
 */
function normalizeBranchPowersets(build: Build): void {
  const archetype = build.archetype.id ? getArchetype(build.archetype.id) : null;
  if (!archetype?.branches) return;

  for (const branchDef of Object.values(archetype.branches)) {
    if (build.primary.id === branchDef.primarySet) {
      const basePowerset = getPowerset(archetype.primarySets[0]);
      if (basePowerset) {
        build.primary.id = archetype.primarySets[0];
        build.primary.name = basePowerset.name;
      }
    }
    if (build.secondary.id === branchDef.secondarySet) {
      const basePowerset = getPowerset(archetype.secondarySets[0]);
      if (basePowerset) {
        build.secondary.id = archetype.secondarySets[0];
        build.secondary.name = basePowerset.name;
      }
    }
  }
}

/**
 * For VEATs: detect which branch the build's powers belong to.
 * Scans primary/secondary power names against each branch's powerset definitions.
 */
function detectBranch(build: Build): ArchetypeBranchId | null {
  const archetype = build.archetype.id ? getArchetype(build.archetype.id) : null;
  if (!archetype?.branches) return null;

  const allPowerNames = new Set([
    ...build.primary.powers.map((p) => p.internalName.toLowerCase()),
    ...build.secondary.powers.map((p) => p.internalName.toLowerCase()),
  ]);

  for (const [branchId, branch] of Object.entries(archetype.branches)) {
    if (!branch) continue;
    const branchPrimary = branch.primarySet ? getPowerset(branch.primarySet) : null;
    const branchSecondary = getPowerset(branch.secondarySet);
    const branchPowerNames = [
      ...(branchPrimary?.powers ?? []).map((p) => p.internalName.toLowerCase()),
      ...(branchSecondary?.powers ?? []).map((p) => p.internalName.toLowerCase()),
    ];
    if (branchPowerNames.some((name) => allPowerNames.has(name))) {
      return branchId as ArchetypeBranchId;
    }
  }
  return null;
}

/**
 * Apply a power array updater to the correct category in a build.
 * Eliminates the repeated switch-on-PowerCategory pattern.
 */
function applyPowerUpdate(
  build: Build,
  category: PowerCategory,
  updater: (powers: SelectedPower[]) => SelectedPower[]
): Build {
  const newBuild = { ...build };

  switch (category) {
    case 'primary':
      newBuild.primary = { ...newBuild.primary, powers: updater(newBuild.primary.powers) };
      break;
    case 'secondary':
      newBuild.secondary = { ...newBuild.secondary, powers: updater(newBuild.secondary.powers) };
      break;
    case 'pool':
      newBuild.pools = newBuild.pools.map(pool => ({ ...pool, powers: updater(pool.powers) }));
      break;
    case 'epic':
      if (newBuild.epicPool) {
        newBuild.epicPool = { ...newBuild.epicPool, powers: updater(newBuild.epicPool.powers) };
      }
      break;
    case 'inherent':
      newBuild.inherents = updater(newBuild.inherents);
      break;
  }

  return newBuild;
}

/**
 * Apply a power array updater to ALL non-inherent categories.
 * Used for operations like togglePowerActive that apply across the whole build.
 */
function applyToAllPowers(
  build: Build,
  updater: (powers: SelectedPower[]) => SelectedPower[]
): Build {
  return {
    ...build,
    primary: { ...build.primary, powers: updater(build.primary.powers) },
    secondary: { ...build.secondary, powers: updater(build.secondary.powers) },
    pools: build.pools.map(pool => ({ ...pool, powers: updater(pool.powers) })),
    epicPool: build.epicPool
      ? { ...build.epicPool, powers: updater(build.epicPool.powers) }
      : null,
  };
}

/**
 * Convert an InherentPowerDef to a SelectedPower
 */
function createInherentSelectedPower(def: InherentPowerDef): SelectedPower {
  // Archetype inherents have 0 maxSlots and should have no slots
  const slots: (Enhancement | null)[] = def.maxSlots === 0 ? [] : [null];
  // Use available level + 1 for display (available is 0-indexed), default to level 1
  const level = (def.available != null && def.available > 0) ? def.available + 1 : 1;

  return {
    ...def,
    powerSet: 'Inherent',
    level,
    slots,
    isLocked: def.isLocked ?? true, // All inherent powers are locked by default
    inherentCategory: def.category,
  };
}

/**
 * Get all inherent powers as SelectedPower objects
 * @param archetypeId - The archetype ID for archetype-specific inherents (e.g. 'peacebringer')
 * @param archetypeName - The archetype name for the archetype-specific inherent
 * @param archetypeInherent - The archetype's inherent power definition
 */
function getInherentSelectedPowers(
  archetypeId?: string | null,
  archetypeName?: string,
  archetypeInherent?: { name: string; description: string } | null
): SelectedPower[] {
  const powers = getInherentPowers().map(createInherentSelectedPower);

  // Add archetype-specific inherent if provided
  if (archetypeName && archetypeInherent) {
    const atInherentDef = createArchetypeInherentPower(archetypeName, archetypeInherent);
    // Insert archetype inherent at the beginning
    powers.unshift(createInherentSelectedPower(atInherentDef));
  }

  // Add archetype-specific inherent powers (e.g. Kheldian travel powers)
  const extraInherents = getArchetypeInherentPowers(archetypeId || undefined);
  for (const def of extraInherents) {
    powers.push(createInherentSelectedPower(def));
  }

  return powers;
}

/**
 * Count total selected powers (excluding inherents and auto-granted form sub-powers)
 */
function countSelectedPowers(build: Build): number {
  const countNonGranted = (powers: SelectedPower[]) =>
    powers.filter(p => !p.isAutoGranted).length;

  return (
    countNonGranted(build.primary.powers) +
    countNonGranted(build.secondary.powers) +
    build.pools.reduce((sum, pool) => sum + countNonGranted(pool.powers), 0) +
    (build.epicPool ? countNonGranted(build.epicPool.powers) : 0)
  );
}

/**
 * Collect the set of pick levels already occupied by existing powers.
 */
function getOccupiedLevels(build: Build): Set<number> {
  const occupied = new Set<number>();
  const collectNonGranted = (powers: SelectedPower[]) =>
    powers.filter(p => !p.isAutoGranted).forEach(p => occupied.add(p.level));

  collectNonGranted(build.primary.powers);
  collectNonGranted(build.secondary.powers);
  build.pools.forEach((pool) => collectNonGranted(pool.powers));
  if (build.epicPool) collectNonGranted(build.epicPool.powers);
  return occupied;
}

/**
 * Calculate the correct build level based on the current number of selected powers.
 * Works bidirectionally — advances when powers are added, rewinds when removed.
 * Checks which pick levels are actually occupied to avoid assigning duplicates.
 */
export function calculateCorrectLevel(build: Build): number {
  // Level 1 special: need both a primary and secondary power before advancing
  const hasPrimary = build.primary.powers.length >= 1;
  const hasSecondary = build.secondary.powers.length >= 1;
  if (!hasPrimary || !hasSecondary) {
    return 1;
  }

  // Check which pick levels already have a power assigned
  const occupied = getOccupiedLevels(build);

  // Level 1 gets two picks — only consider it "full" if both primary and secondary exist
  const level1Count = [
    ...build.primary.powers.filter(p => !p.isAutoGranted),
    ...build.secondary.powers.filter(p => !p.isAutoGranted),
  ].filter(p => p.level === 1).length;

  // Find the first unoccupied pick level
  // Level 1 is special: it needs 2 powers, so only skip it if both slots are filled
  for (const level of POWER_PICK_LEVELS) {
    if (level === 1) {
      if (level1Count < 2) return 1;
    } else if (!occupied.has(level)) {
      return level;
    }
  }

  // All 24 picks used — advance to max level so final slots are unlocked
  return 50;
}

// ============================================
// STORE CREATION
// ============================================

export const useBuildStore = create<BuildStore>()(
  persist(
    (set, get) => {
      // Undo/redo checkpoint helper — call before mutations
      const historyCheckpoint = () => {
        const { _isRestoring } = useHistoryStore.getState();
        if (!_isRestoring) {
          useHistoryStore.getState().checkpoint(get().build);
        }
      };

      return ({
      // Initial state
      build: createEmptyBuild(),
      _hasHydrated: false,

      // Hydration tracking
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      // History restore (used by undo/redo)
      _restoreBuild: (build) => set({ build }),

      // Build metadata
      setBuildName: (name) => {
        historyCheckpoint();
        set((state) => ({
          build: { ...state.build, name },
        }));
      },

      // Archetype
      setArchetype: (archetypeId) => {
        const archetype = getArchetype(archetypeId);
        if (!archetype) return;
        historyCheckpoint();

        set((state) => ({
          build: {
            ...state.build,
            archetype: {
              id: archetypeId,
              name: archetype.name,
              stats: archetype.stats,
              inherent: archetype.inherent,
            },
            // Reset powersets when archetype changes
            primary: { id: null, name: '', powers: [] },
            secondary: { id: null, name: '', powers: [] },
            pools: [],
            epicPool: null,
            inherents: [], // Clear inherents when archetype changes
          },
        }));
      },

      clearArchetype: () => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            archetype: { id: null, name: '', stats: null, inherent: null },
            primary: { id: null, name: '', powers: [] },
            secondary: { id: null, name: '', powers: [] },
            pools: [],
            epicPool: null,
            inherents: [], // Clear inherents
          },
        }));
      },

      // Powersets
      setPrimary: (powersetId) => {
        const powerset = getPowerset(powersetId);
        if (!powerset) return;
        historyCheckpoint();

        set((state) => {
          const removedNames = new Set(state.build.primary.powers.map((p) => p.internalName));
          const newBuild = {
            ...state.build,
            primary: {
              id: powersetId,
              name: powerset.name,
              powers: [], // Clear powers when powerset changes
            },
            slotOrder: state.build.slotOrder.filter((e) => !removedNames.has(e.powerName)),
          };

          // Auto-grant inherent powers if both powersets are now selected
          if (newBuild.secondary.id && newBuild.inherents.length === 0) {
            newBuild.inherents = getInherentSelectedPowers(
              state.build.archetype.id,
              state.build.archetype.name || undefined,
              state.build.archetype.inherent
            );
          }

          return { build: newBuild };
        });
      },

      setSecondary: (powersetId) => {
        const powerset = getPowerset(powersetId);
        if (!powerset) return;
        historyCheckpoint();

        set((state) => {
          const removedNames = new Set(state.build.secondary.powers.map((p) => p.internalName));
          const newBuild = {
            ...state.build,
            secondary: {
              id: powersetId,
              name: powerset.name,
              powers: [],
            },
            slotOrder: state.build.slotOrder.filter((e) => !removedNames.has(e.powerName)),
          };

          // Auto-grant inherent powers if both powersets are now selected
          if (newBuild.primary.id && newBuild.inherents.length === 0) {
            newBuild.inherents = getInherentSelectedPowers(
              state.build.archetype.id,
              state.build.archetype.name || undefined,
              state.build.archetype.inherent
            );
          }

          return { build: newBuild };
        });
      },

      // Powers
      addPower: (category, power) => {
        historyCheckpoint();
        set((state) => {
          // Enforce 24-power limit (inherents don't count)
          if (category !== 'inherent' && countSelectedPowers(state.build) >= MAX_POWER_PICKS) {
            return state;
          }

          // Assign a valid pick level for this power.
          // The level must be:
          //   1. A valid POWER_PICK_LEVEL (1, 2, 4, 6, 8, ...)
          //   2. Not already occupied by another power
          //   3. At or above the power's minimum required level (available + 1)
          // This allows picking powers in any order — each gets placed at the
          // earliest legal level, and the chronological view shows them correctly.
          if (category !== 'inherent') {
            const categoryMin = category === 'pool' ? POOL_UNLOCK_LEVEL
              : category === 'epic' ? EPIC_POOL_LEVEL
              : 1;
            const minLevel = Math.max((power.available ?? 0) + 1, categoryMin);
            const nextSequential = calculateCorrectLevel(state.build);
            if (nextSequential >= minLevel) {
              power = { ...power, level: nextSequential };
            } else {
              // Power requires a higher level — find first unoccupied pick level >= minLevel
              const occupied = getOccupiedLevels(state.build);
              const assignedLevel = POWER_PICK_LEVELS.find(
                l => l >= minLevel && (l === 1 ? false : !occupied.has(l))
              ) ?? 50;
              power = { ...power, level: assignedLevel };
            }
          }

          // Powers with maxSlots=0 cannot accept enhancement slots (e.g., Reach for the Limit)
          if (power.maxSlots === 0 && power.slots.length > 0) {
            power = { ...power, slots: [] };
          }

          // Default toggle/auto powers to active; also activate Click self-buff powers
          // with long durations (60s+) like Hasten and Practiced Brawler, since they're
          // effectively permanent when maintained. Short-duration clicks like Build Up (10s)
          // are left off by default — users can toggle them on manually.
          if (power.isActive === undefined) {
            const pt = power.powerType?.toLowerCase();
            const buffDuration = (power.effects as Record<string, unknown>)?.buffDuration;
            const isLongSelfBuff = pt === 'click'
              && typeof buffDuration === 'number' && buffDuration >= 60
              && (power.targetType?.toLowerCase() === 'self'
                || (power.shortHelp?.toLowerCase().startsWith('self ') ?? false));
            if (pt === 'toggle' || pt === 'auto' || isLongSelfBuff) {
              power = { ...power, isActive: true };
            }
          }

          // Enforce mutually exclusive powers (e.g., Slice vs Boomerang Slice)
          // If this power excludes another, check if the excluded power is already picked
          if (power.excludes?.length) {
            const categoryPowers = category === 'primary' ? state.build.primary.powers
              : category === 'secondary' ? state.build.secondary.powers
              : category === 'epic' ? (state.build.epicPool?.powers ?? [])
              : [];
            const hasExcluded = categoryPowers.some(p => power.excludes!.includes(p.internalName));
            if (hasExcluded) return state;
          }

          // Pool case: must target the specific pool by ID
          let newBuild: Build;
          if (category === 'pool') {
            newBuild = { ...state.build };
            const poolIndex = newBuild.pools.findIndex((p) =>
              p.id === power.powerSet || power.powerSet.includes(p.id)
            );
            if (poolIndex >= 0) {
              newBuild.pools = [...newBuild.pools];
              newBuild.pools[poolIndex] = {
                ...newBuild.pools[poolIndex],
                powers: [...newBuild.pools[poolIndex].powers, power],
              };
            }
          } else {
            newBuild = applyPowerUpdate(state.build, category, (powers) => [...powers, power]);
          }

          // Auto-grant slottable sub-powers when a form power is added (e.g., Kheldian forms)
          const formGroup = GRANTED_POWER_GROUPS[power.internalName];
          if (formGroup?.slottable && formGroup.grantedPowers.length > 0) {
            // Find the powerset definition to get full sub-power data
            const powersetId = power.powerSet;
            const powersetDef = powersetId ? getPowerset(powersetId) : null;
            if (powersetDef) {
              const subPowerDefs = powersetDef.powers.filter(p =>
                formGroup.grantedPowers.includes(p.internalName)
              );
              for (const subPowerDef of subPowerDefs) {
                const subPower: SelectedPower = {
                  ...subPowerDef,
                  powerSet: powersetId,
                  level: power.level,
                  slots: [null],
                  isAutoGranted: true,
                  grantedByPower: power.internalName,
                  isActive: (subPowerDef.powerType === 'Toggle' || subPowerDef.powerType === 'Auto') ? true : undefined,
                };
                // Add sub-power to the same category
                newBuild = applyPowerUpdate(newBuild, category, (powers) => [...powers, subPower]);
              }
            }
          }

          // Auto-advance level if all power picks for current level have been used.
          // Only auto-advance for primary/secondary/pool powers (not inherents).
          // Never decrease — respect user's manually-set level.
          if (category !== 'inherent') {
            newBuild.level = Math.max(state.build.level, calculateCorrectLevel(newBuild));
          }

          return { build: newBuild };
        });
      },

      removePower: (category, powerName) => {
        historyCheckpoint();
        set((state) => {
          // Inherent: only allow removal of unlocked powers
          const updater = category === 'inherent'
            ? (powers: SelectedPower[]) => powers.filter((p) => p.internalName !== powerName || p.isLocked)
            : (powers: SelectedPower[]) => powers.filter((p) => p.internalName !== powerName);

          let newBuild = applyPowerUpdate(state.build, category, updater);

          // Also remove auto-granted sub-powers when removing a form power
          const formGroup = GRANTED_POWER_GROUPS[powerName];
          if (formGroup?.slottable && formGroup.grantedPowers.length > 0) {
            const subPowerNames = new Set(formGroup.grantedPowers);
            newBuild = applyPowerUpdate(newBuild, category, (powers) =>
              powers.filter((p) => !subPowerNames.has(p.internalName))
            );
          }

          // Keep the user's current level — don't rewind on removal
          // (addPower auto-advances but removePower should never lower it)

          newBuild.sets = updateSetTracking(newBuild);
          // Remove slotOrder entries for removed power(s)
          const removedNames = new Set([powerName]);
          if (formGroup?.slottable) {
            for (const name of formGroup.grantedPowers) removedNames.add(name);
          }
          newBuild.slotOrder = newBuild.slotOrder.filter((e) => !removedNames.has(e.powerName));
          return { build: newBuild };
        });
      },

      movePowerLevel: (category, powerName, newLevel) => {
        historyCheckpoint();
        set((state) => ({
          build: applyPowerUpdate(state.build, category, (powers) =>
            powers.map((p) => (p.internalName === powerName ? { ...p, level: newLevel } : p))
          ),
        }));
      },

      swapPowerLevels: (powerNameA, powerNameB) => {
        historyCheckpoint();
        set((state) => {
          const foundA = findPower(state.build, powerNameA);
          const foundB = findPower(state.build, powerNameB);
          if (!foundA || !foundB) return state;

          const levelA = foundA.power.level;
          const levelB = foundB.power.level;

          let newBuild = applyPowerUpdate(state.build, foundA.category, (powers) =>
            powers.map((p) => (p.internalName === powerNameA ? { ...p, level: levelB } : p))
          );
          newBuild = applyPowerUpdate(newBuild, foundB.category, (powers) =>
            powers.map((p) => (p.internalName === powerNameB ? { ...p, level: levelA } : p))
          );

          return { build: newBuild };
        });
      },

      // Pools
      addPool: (poolId) => {
        const state = get();
        if (state.build.pools.length >= MAX_POWER_POOLS) return false;

        const pool = getPowerPool(poolId);
        if (!pool) return false;

        // Check if pool is already selected
        if (state.build.pools.some((p) => p.id === poolId)) return false;

        // Check mutual exclusion (e.g., Sorcery / Experimentation / Force of Will)
        const excluded = getExcludedPools(poolId);
        if (excluded && state.build.pools.some((p) => excluded.includes(p.id))) return false;

        historyCheckpoint();
        set((s) => ({
          build: {
            ...s.build,
            pools: [
              ...s.build.pools,
              {
                id: poolId,
                name: pool.name,
                powers: [],
              },
            ],
          },
        }));

        return true;
      },

      removePool: (poolId) => {
        historyCheckpoint();
        set((state) => {
          const removedPool = state.build.pools.find((p) => p.id === poolId);
          const removedNames = new Set(removedPool?.powers.map((p) => p.internalName) ?? []);
          const newBuild = {
            ...state.build,
            pools: state.build.pools.filter((p) => p.id !== poolId),
            slotOrder: state.build.slotOrder.filter((e) => !removedNames.has(e.powerName)),
          };
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      setEpicPool: (poolId) => {
        historyCheckpoint();
        if (!poolId) {
          set((state) => {
            const removedNames = new Set(state.build.epicPool?.powers.map((p) => p.internalName) ?? []);
            const newBuild = {
              ...state.build,
              epicPool: null,
              slotOrder: state.build.slotOrder.filter((e) => !removedNames.has(e.powerName)),
            };
            newBuild.sets = updateSetTracking(newBuild);
            return { build: newBuild };
          });
          return;
        }

        // Use the epic pool registry instead of regular power pools
        const pool = getEpicPool(poolId);
        if (!pool) return;

        set((state) => ({
          build: {
            ...state.build,
            epicPool: {
              id: poolId,
              name: pool.displayName || pool.name,
              powers: [],
            },
          },
        }));
      },

      // Slots
      addSlot: (powerName, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return false;

        const { power, category } = found;

        // Check if power can have more slots
        if (power.slots.length >= power.maxSlots) return false;

        // Check total placed slot limit (level-aware)
        // Only count additional slots beyond each power's free first slot.
        // Inherent power slots are excluded entirely from the budget.
        if (countPlacedSlots(state.build) >= getPlacedSlotLimit(state.build.level)) return false;

        historyCheckpoint();
        const newSlotIndex = power.slots.length; // index of the slot being added
        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.internalName === powerName ? { ...p, slots: [...p.slots, null] } : p
            )
          );
          newBuild.slotOrder = [...newBuild.slotOrder, { powerName, slotIndex: newSlotIndex, category }];
          return { build: newBuild };
        });

        return true;
      },

      removeSlot: (powerName, slotIndex, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return false;

        const { power, category } = found;

        // Can't remove the first slot (it's free with the power)
        if (slotIndex === 0) return false;

        // Check if slot exists
        if (slotIndex >= power.slots.length) return false;

        historyCheckpoint();
        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.internalName === powerName
                ? { ...p, slots: p.slots.filter((_, i) => i !== slotIndex) }
                : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          // Remove this slot from slotOrder and adjust higher indices for same power
          // Match by both powerName and category to avoid collisions with same-named powers
          const matchesEntry = (e: { powerName: string; category?: string }) =>
            e.powerName === powerName && (!e.category || e.category === category);
          newBuild.slotOrder = newBuild.slotOrder
            .filter((e) => !(matchesEntry(e) && e.slotIndex === slotIndex))
            .map((e) =>
              matchesEntry(e) && e.slotIndex > slotIndex
                ? { ...e, slotIndex: e.slotIndex - 1 }
                : e
            );
          return { build: newBuild };
        });

        return true;
      },

      clearSlotOrder: () => {
        set((s) => ({
          build: { ...s.build, slotOrder: [] },
        }));
      },

      // Enhancements
      setEnhancement: (powerName, slotIndex, enhancement, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return;

        historyCheckpoint();
        const { category } = found;

        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.internalName === powerName
                ? { ...p, slots: p.slots.map((slot, i) => (i === slotIndex ? enhancement : slot)) }
                : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      clearEnhancement: (powerName, slotIndex, categoryHint) => {
        get().setEnhancement(powerName, slotIndex, null as unknown as Enhancement, categoryHint);
      },

      clearAllEnhancements: (powerName, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return;

        historyCheckpoint();
        const { category } = found;

        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.internalName === powerName ? { ...p, slots: p.slots.map(() => null) } : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      // Settings
      setLevel: (level) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            level: Math.max(1, Math.min(50, level)),
          },
        }));
      },

      setExemplarLevel: (level) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            exemplarLevel: level ? Math.max(1, Math.min(state.build.level, level)) : null,
          },
        }));
      },

      setProgressionMode: (mode) => {
        historyCheckpoint();
        set((state) => ({
          build: { ...state.build, progressionMode: mode },
        }));
      },

      setOrigin: (origin) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            settings: { ...state.build.settings, origin },
          },
        }));
      },

      setGlobalIOLevel: (level) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            settings: {
              ...state.build.settings,
              globalIOLevel: Math.max(10, Math.min(53, level)),
            },
          },
        }));
      },

      // Accolades
      addAccolade: (accolade) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            accolades: [...state.build.accolades, accolade],
          },
        }));
      },

      removeAccolade: (accoladeId) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            accolades: state.build.accolades.filter((a) => a.id !== accoladeId),
          },
        }));
      },

      // Incarnates
      setIncarnatePower: (slotId, power) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            incarnates: {
              ...state.build.incarnates,
              [slotId]: power,
            },
          },
        }));
      },

      clearIncarnatePower: (slotId) => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            incarnates: {
              ...state.build.incarnates,
              [slotId]: null,
            },
          },
        }));
      },

      clearAllIncarnates: () => {
        historyCheckpoint();
        set((state) => ({
          build: {
            ...state.build,
            incarnates: createEmptyIncarnateBuildState(),
          },
        }));
      },

      // Incarnate Crafting Checklist
      toggleCraftingCheckItem: (key) =>
        set((state) => ({
          build: {
            ...state.build,
            craftingChecklist: {
              ...state.build.craftingChecklist,
              [key]: !state.build.craftingChecklist[key],
            },
          },
        })),

      setCraftingCheckItem: (key, checked) =>
        set((state) => ({
          build: {
            ...state.build,
            craftingChecklist: {
              ...state.build.craftingChecklist,
              [key]: checked,
            },
          },
        })),

      clearCraftingChecklist: () =>
        set((state) => ({
          build: {
            ...state.build,
            craftingChecklist: createEmptyCraftingChecklistState(),
          },
        })),

      clearCraftingChecklistForSlot: (slotId) =>
        set((state) => {
          const filtered = Object.fromEntries(
            Object.entries(state.build.craftingChecklist).filter(
              ([key]) => !key.startsWith(`${slotId}:`)
            )
          );
          return { build: { ...state.build, craftingChecklist: filtered } };
        }),

      // Shopping List
      acquireShoppingItem: (salvageId) =>
        set((state) => ({
          build: {
            ...state.build,
            shoppingListAcquired: {
              ...state.build.shoppingListAcquired,
              [salvageId]: (state.build.shoppingListAcquired[salvageId] || 0) + 1,
            },
          },
        })),

      unacquireShoppingItem: (salvageId) =>
        set((state) => {
          const current = state.build.shoppingListAcquired[salvageId] || 0;
          if (current <= 0) return state;
          return {
            build: {
              ...state.build,
              shoppingListAcquired: {
                ...state.build.shoppingListAcquired,
                [salvageId]: current - 1,
              },
            },
          };
        }),

      clearShoppingListAcquired: () =>
        set((state) => ({
          build: { ...state.build, shoppingListAcquired: {} },
        })),

      // Power toggle (for stat calculations)
      togglePowerActive: (powerName, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return;
        historyCheckpoint();
        set((s) => ({
          build: applyPowerUpdate(s.build, found.category, (powers) =>
            powers.map((p) =>
              p.internalName === powerName ? { ...p, isActive: !p.isActive } : p
            )
          ),
        }));
      },

      // Set active sub-power for powers with mutually exclusive stances
      setActiveSubPower: (parentPowerName, subPowerName) => {
        historyCheckpoint();
        set((state) => ({
          build: applyToAllPowers(state.build, (powers) =>
            powers.map((p) =>
              p.internalName === parentPowerName
                ? { ...p, activeSubPower: subPowerName ?? undefined }
                : p
            )
          ),
        }));
      },

      // Computed
      getTotalSlotsUsed: () => countTotalSlots(get().build),

      getSlotsRemaining: () => {
        const build = get().build;
        return getPlacedSlotLimit(build.level) - countPlacedSlots(build);
      },

      getActiveSetBonuses: () => {
        const bonuses: Array<{ setId: string; bonusIndex: number }> = [];
        const { sets } = get().build;

        for (const [setId, tracking] of Object.entries(sets)) {
          // Add bonuses for each threshold reached
          // Typically bonuses are at 2, 3, 4, 5, 6 pieces
          for (let pieces = 2; pieces <= tracking.count; pieces++) {
            bonuses.push({ setId, bonusIndex: pieces - 2 });
          }
        }

        return bonuses;
      },

      canAddSlot: (powerName, categoryHint) => {
        const state = get();
        const found = findPower(state.build, powerName, categoryHint);
        if (!found) return false;

        return (
          found.power.slots.length < found.power.maxSlots &&
          countPlacedSlots(state.build) < getPlacedSlotLimit(state.build.level)
        );
      },

      canAddPool: () => get().build.pools.length < MAX_POWER_POOLS,

      canSelectEpicPool: () => get().build.level >= EPIC_POOL_LEVEL,

      isUniqueEnhancementSlotted: (setId: string, pieceNum: number) =>
        isUniqueEnhancementSlotted(get().build, setId, pieceNum),

      isPrestigeSlotted: (prestigeId: string) =>
        isPrestigeEnhancementSlotted(get().build, prestigeId),

      // Import/Export
      exportBuild: () => {
        const { build } = get();
        const exportData = {
          version: 3,
          build: slimBuild(build),
          meta: {
            exportedAt: new Date().toISOString(),
          },
        };
        return JSON.stringify(exportData, null, 2);
      },

      importBuild: (json) => {
        historyCheckpoint();
        try {
          const data = JSON.parse(json);
          let build: Build;

          if (data.version === 2 || data.version === 3) {
            // v2/v3 slim format — reconstruct full Build from identity + build-specific fields
            // v3 adds internalName to SlimPower; v2 uses display name fallback
            build = hydrateBuild(data.build);
          } else {
            // v1 (legacy) — full Build object, just convert Set serialization
            const setsEntries = Object.entries(data.build.sets || {}) as [
              string,
              { count: number; pieces: number[] }
            ][];
            build = {
              ...data.build,
              sets: Object.fromEntries(
                setsEntries.map(([setId, tracking]) => [
                  setId,
                  { count: tracking.count, pieces: new Set(tracking.pieces) },
                ])
              ),
            };
          }

          // Default slotOrder for builds that don't have it (older saves)
          if (!build.slotOrder) {
            build.slotOrder = [];
          }

          // Sync power definitions (effects, icons) and enhancement icons
          // from current data — fixes stale data from older exports/shares
          syncBuildDefinitions(build);

          // Normalize VEAT branch powersets to base powersets
          normalizeBranchPowersets(build);

          // Auto-detect branch for VEAT builds (so branch powers appear in the picker)
          const branch = detectBranch(build);
          if (branch) {
            useUIStore.getState().setSelectedBranch(branch);
          }

          set({ build });
          return true;
        } catch (e) {
          console.error('Failed to import build:', e);
          return false;
        }
      },

      importMidsBuild: (build) => {
        historyCheckpoint();
        if (!build.slotOrder) {
          build.slotOrder = [];
        }
        set({ build });
      },

      resetBuild: () => {
        historyCheckpoint();
        set({ build: createEmptyBuild() });
      },

      clearPowers: () => {
        historyCheckpoint();
        set((state) => {
          // Normalize branch powersets back to base for VEATs
          // (e.g., after importing a Crab Spider, branch powersets may be set as primary/secondary)
          let primary = { ...state.build.primary, powers: [] as SelectedPower[] };
          let secondary = { ...state.build.secondary, powers: [] as SelectedPower[] };
          const archetype = state.build.archetype.id ? getArchetype(state.build.archetype.id) : null;
          if (archetype?.branches) {
            for (const branchDef of Object.values(archetype.branches)) {
              if (primary.id === branchDef.primarySet) {
                const basePowerset = getPowerset(archetype.primarySets[0]);
                if (basePowerset) {
                  primary = { id: archetype.primarySets[0], name: basePowerset.name, powers: [] };
                }
              }
              if (secondary.id === branchDef.secondarySet) {
                const basePowerset = getPowerset(archetype.secondarySets[0]);
                if (basePowerset) {
                  secondary = { id: archetype.secondarySets[0], name: basePowerset.name, powers: [] };
                }
              }
            }
          }

          return {
            build: {
              ...state.build,
              primary,
              secondary,
              pools: [],
              epicPool: null,
              accolades: [],
              incarnates: createEmptyIncarnateBuildState(),
              craftingChecklist: createEmptyCraftingChecklistState(),
              sets: {},
              slotOrder: [],
              // Re-grant inherents with fresh empty slots
              inherents: getInherentSelectedPowers(
                state.build.archetype.id,
                state.build.archetype.name || undefined,
                state.build.archetype.inherent
              ),
            },
          };
        });
      },
    });},
    {
      name: 'coh-planner-build',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        build: {
          ...state.build,
          // Convert Sets to arrays for storage
          sets: Object.fromEntries(
            Object.entries(state.build.sets).map(([setId, tracking]) => [
              setId,
              { count: tracking.count, pieces: Array.from(tracking.pieces) },
            ])
          ),
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert pieces arrays back to Sets after rehydration
          // The persisted state has arrays, but we need Sets
          const setsEntries = Object.entries(state.build.sets || {}) as [
            string,
            { count: number; pieces: number[] | Set<number> }
          ][];
          const sets = Object.fromEntries(
            setsEntries.map(([setId, tracking]) => [
              setId,
              {
                count: tracking.count,
                pieces:
                  tracking.pieces instanceof Set
                    ? tracking.pieces
                    : new Set(tracking.pieces as number[]),
              },
            ])
          );
          state.build.sets = sets;

          // Migration: Grant inherent powers if missing but both powersets are selected
          // This handles builds created before inherent powers were implemented
          if (
            state.build.inherents.length === 0 &&
            state.build.primary.id &&
            state.build.secondary.id
          ) {
            state.build.inherents = getInherentSelectedPowers(
              state.build.archetype.id,
              state.build.archetype.name || undefined,
              state.build.archetype.inherent
            );
          }

          // Migration: Update existing inherent powers' maxSlots from current definitions
          // This fixes powers like Rest that may have been saved with wrong maxSlots
          if (state.build.inherents.length > 0) {
            state.build.inherents = state.build.inherents.map((power) => {
              const def = getInherentPowerDef(power.internalName)
                ?? getInherentPowerDef(power.name.replace(/\s+/g, '_'));
              if (def && power.maxSlots !== def.maxSlots) {
                return { ...power, maxSlots: def.maxSlots };
              }
              return power;
            });
          }

          // Migration: Initialize incarnates if missing (for builds created before incarnate system)
          if (!state.build.incarnates) {
            state.build.incarnates = createEmptyIncarnateBuildState();
          }

          // Migration: Initialize crafting checklist if missing
          if (!state.build.craftingChecklist) {
            state.build.craftingChecklist = createEmptyCraftingChecklistState();
          }

          // Migration: Convert old crafting keys with trailing :idx to new format without idx
          // Old: "alpha:vigor:1:core:salvage:ArcaneCantrip:0" → New: "alpha:vigor:1:core:salvage:ArcaneCantrip"
          if (state.build.craftingChecklist && Object.keys(state.build.craftingChecklist).length > 0) {
            const migrated: Record<string, boolean> = {};
            let needsMigration = false;
            for (const [key, value] of Object.entries(state.build.craftingChecklist)) {
              const match = key.match(/^(.+:salvage:\w+):\d+$/);
              if (match) {
                needsMigration = true;
                if (value) migrated[match[1]] = true;
              } else {
                migrated[key] = value;
              }
            }
            if (needsMigration) {
              state.build.craftingChecklist = migrated;
            }
          }

          // Migration: Initialize shopping list acquired if missing
          if (!state.build.shoppingListAcquired) {
            state.build.shoppingListAcquired = {};
          }

          // Migration: Initialize slotOrder if missing (builds before leveling mode)
          if (!state.build.slotOrder) {
            state.build.slotOrder = [];
          }

          // Migration: Rename old accolade IDs to match game internal names
          if (state.build.accolades?.length > 0) {
            const accoladeIdMap: Record<string, string> = {
              'atlas_medallion': 'the_atlas_medallion',
              'freedom_phalanx': 'freedom_phalanx_reserve',
            };
            state.build.accolades = state.build.accolades.map((a) => {
              const newId = accoladeIdMap[a.id];
              return newId ? { ...a, id: newId } : a;
            });
          }

          // Migration: Normalize VEAT branch powersets to base powersets
          // Fixes builds where branch powersets (e.g., crab-spider-soldier) were
          // stored as the primary/secondary instead of the base powersets
          normalizeBranchPowersets(state.build);

          // Migration: Sync power definitions (effects, icons) and enhancement icons
          // from current data — fixes stale data from older builds
          syncBuildDefinitions(state.build);

          // Migration: Convert display-name identifiers to internalName
          // Old builds stored display names (e.g., "Super Speed") in slotOrder,
          // activeSubPower, and grantedByPower. Convert to internalName format.
          {
            // Build a display-name → internalName lookup from all hydrated powers
            const nameToInternal = new Map<string, string>();
            const allBuildPowers = [
              ...state.build.primary.powers,
              ...state.build.secondary.powers,
              ...state.build.pools.flatMap((pool) => pool.powers),
              ...(state.build.epicPool?.powers ?? []),
              ...state.build.inherents,
            ];
            for (const p of allBuildPowers) {
              if (p.name !== p.internalName) {
                nameToInternal.set(p.name, p.internalName);
              }
            }

            // Migrate slotOrder entries
            if (state.build.slotOrder) {
              for (const entry of state.build.slotOrder) {
                const mapped = nameToInternal.get(entry.powerName);
                if (mapped) entry.powerName = mapped;
              }
            }

            // Migrate activeSubPower and grantedByPower on all powers
            for (const p of allBuildPowers) {
              if (p.activeSubPower && p.activeSubPower.includes(' ')) {
                p.activeSubPower = p.activeSubPower.replace(/\s+/g, '_');
              }
              if (p.grantedByPower && p.grantedByPower.includes(' ')) {
                p.grantedByPower = p.grantedByPower.replace(/\s+/g, '_');
              }
            }
          }

          // Auto-detect branch for VEAT builds on rehydration
          const branch = detectBranch(state.build);
          if (branch) {
            // Defer to avoid store initialization ordering issues
            setTimeout(() => useUIStore.getState().setSelectedBranch(branch), 0);
          }

          // Migration: Fix power pick levels that don't match valid power pick levels.
          // Older builds may have all powers at the display level (e.g., 50) instead of
          // the correct sequential pick levels (1, 1, 2, 4, 6, ...).
          // This reassigns levels based on category order and selection sequence.
          {
            const allPowers: { power: SelectedPower; category: string; index: number }[] = [];
            // Exclude auto-granted form sub-powers from level migration
            state.build.primary.powers.filter(p => !p.isAutoGranted).forEach((p, i) => allPowers.push({ power: p, category: 'primary', index: i }));
            state.build.secondary.powers.filter(p => !p.isAutoGranted).forEach((p, i) => allPowers.push({ power: p, category: 'secondary', index: i }));
            state.build.pools.forEach((pool) => pool.powers.filter(p => !p.isAutoGranted).forEach((p, i) => allPowers.push({ power: p, category: 'pool', index: i })));
            if (state.build.epicPool) {
              state.build.epicPool.powers.filter(p => !p.isAutoGranted).forEach((p, i) => allPowers.push({ power: p, category: 'epic', index: i }));
            }

            // Check if any non-inherent power has a level that isn't a valid pick level,
            // OR if there are duplicate levels (e.g., 6 primaries all at level 1)
            const pickLevelSet = new Set(POWER_PICK_LEVELS);
            const hasInvalidLevels = allPowers.some((entry) => !pickLevelSet.has(entry.power.level));

            // Detect duplicate levels: count how many powers occupy each level
            // Level 1 allows 2 powers (primary + secondary), all others allow 1
            let hasDuplicateLevels = false;
            if (!hasInvalidLevels && allPowers.length > 0) {
              const levelCounts = new Map<number, number>();
              for (const entry of allPowers) {
                levelCounts.set(entry.power.level, (levelCounts.get(entry.power.level) || 0) + 1);
              }
              for (const [level, count] of levelCounts) {
                if (level === 1 && count > 2) { hasDuplicateLevels = true; break; }
                if (level !== 1 && count > 1) { hasDuplicateLevels = true; break; }
              }
            }

            if ((hasInvalidLevels || hasDuplicateLevels) && allPowers.length > 0) {
              // Level 1 is special: one primary + one secondary. Pull those out first
              // to guarantee they get level 1, regardless of how many of each exist.
              const firstPrimaryIdx = allPowers.findIndex((e) => e.category === 'primary');
              const firstSecondaryIdx = allPowers.findIndex((e) => e.category === 'secondary');

              const level1Powers: typeof allPowers = [];
              const restPowers: typeof allPowers = [];

              allPowers.forEach((entry, idx) => {
                if (idx === firstPrimaryIdx || idx === firstSecondaryIdx) {
                  level1Powers.push(entry);
                } else {
                  restPowers.push(entry);
                }
              });

              // Sort level 1 powers: primary before secondary
              level1Powers.sort((a, b) => {
                const order = { primary: 0, secondary: 1, pool: 2, epic: 3 };
                return (order[a.category as keyof typeof order] ?? 9) -
                       (order[b.category as keyof typeof order] ?? 9);
              });

              // Sort remaining powers by their original level, then by category
              const categoryOrder = { primary: 0, secondary: 1, pool: 2, epic: 3 };
              restPowers.sort((a, b) => {
                if (a.power.level !== b.power.level) return a.power.level - b.power.level;
                return (categoryOrder[a.category as keyof typeof categoryOrder] ?? 9) -
                       (categoryOrder[b.category as keyof typeof categoryOrder] ?? 9);
              });

              // Recombine: level 1 powers first, then the rest
              const sorted = [...level1Powers, ...restPowers];

              // Assign correct pick levels sequentially
              // Level 1 gets 2 picks (primary + secondary), remaining levels get 1 each
              const pickSlots = [1, 1, ...POWER_PICK_LEVELS.slice(1)]; // [1, 1, 2, 4, 6, 8, ...]
              let anyChanged = false;
              sorted.forEach((entry, idx) => {
                const correctLevel = idx < pickSlots.length ? pickSlots[idx] : POWER_PICK_LEVELS[POWER_PICK_LEVELS.length - 1];
                if (entry.power.level !== correctLevel) {
                  entry.power = { ...entry.power, level: correctLevel };
                  anyChanged = true;
                }
              });

              // Use sorted array for write-back
              allPowers.length = 0;
              allPowers.push(...sorted);

              if (anyChanged) {
                // Write fixed levels back to the build
                const fixedPrimary = allPowers.filter((e) => e.category === 'primary').map((e) => e.power);
                const fixedSecondary = allPowers.filter((e) => e.category === 'secondary').map((e) => e.power);

                if (fixedPrimary.length > 0) {
                  state.build.primary = { ...state.build.primary, powers: fixedPrimary };
                }
                if (fixedSecondary.length > 0) {
                  state.build.secondary = { ...state.build.secondary, powers: fixedSecondary };
                }

                // Fix pool powers — need to maintain pool grouping
                const fixedPoolPowers = allPowers.filter((e) => e.category === 'pool').map((e) => e.power);
                if (fixedPoolPowers.length > 0) {
                  let poolPowerIdx = 0;
                  state.build.pools = state.build.pools.map((pool) => {
                    const count = pool.powers.length;
                    const fixedPowers = fixedPoolPowers.slice(poolPowerIdx, poolPowerIdx + count);
                    poolPowerIdx += count;
                    return { ...pool, powers: fixedPowers };
                  });
                }

                // Fix epic powers
                const fixedEpic = allPowers.filter((e) => e.category === 'epic').map((e) => e.power);
                if (fixedEpic.length > 0 && state.build.epicPool) {
                  state.build.epicPool = { ...state.build.epicPool, powers: fixedEpic };
                }
              }
            }
          }

          state.setHasHydrated(true);
        }
      },
    }
  )
);

// ============================================
// SELECTOR HOOKS
// ============================================

/** Select just the build data */
export const useBuild = () => useBuildStore((state) => state.build);

/** Select just the archetype */
export const useArchetype = () => useBuildStore((state) => state.build.archetype);

/** Select the primary powerset */
export const usePrimary = () => useBuildStore((state) => state.build.primary);

/** Select the secondary powerset */
export const useSecondary = () => useBuildStore((state) => state.build.secondary);

/** Select all pools */
export const usePools = () => useBuildStore((state) => state.build.pools);

/** Select the epic pool */
export const useEpicPool = () => useBuildStore((state) => state.build.epicPool);

/** Select build settings */
export const useBuildSettings = () => useBuildStore((state) => state.build.settings);

/** Select incarnate powers */
export const useIncarnates = () => useBuildStore((state) => state.build.incarnates);

/** Select crafting checklist state */
export const useCraftingChecklist = () => useBuildStore((state) => state.build.craftingChecklist);
