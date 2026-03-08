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
  getInherentPowers,
  getInherentPowerDef,
  getArchetypeInherentPowers,
  createArchetypeInherentPower,
  POWER_PICK_LEVELS,
  getIOSet,
  GRANTED_POWER_GROUPS,
} from '@/data';
import type { InherentPowerDef } from '@/data';
import { computeSetTracking } from '@/utils/calculations/set-tracking';

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

  // Pools
  addPool: (poolId: string) => boolean;
  removePool: (poolId: string) => void;
  setEpicPool: (poolId: string | null) => void;

  // Slots
  addSlot: (powerName: string) => boolean;
  removeSlot: (powerName: string, slotIndex: number) => boolean;

  // Enhancements
  setEnhancement: (powerName: string, slotIndex: number, enhancement: Enhancement) => void;
  clearEnhancement: (powerName: string, slotIndex: number) => void;
  clearAllEnhancements: (powerName: string) => void;

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
  togglePowerActive: (powerName: string) => void;
  /** Set the active sub-power for powers with mutually exclusive stances (e.g., Adaptation) */
  setActiveSubPower: (parentPowerName: string, subPowerName: string | null) => void;

  // Computed
  getTotalSlotsUsed: () => number;
  getSlotsRemaining: () => number;
  getActiveSetBonuses: () => Array<{ setId: string; bonusIndex: number }>;
  canAddSlot: (powerName: string) => boolean;
  canAddPool: () => boolean;
  canSelectEpicPool: () => boolean;
  isUniqueEnhancementSlotted: (setId: string, pieceNum: number) => boolean;

  // Import/Export
  exportBuild: () => string;
  importBuild: (json: string) => boolean;
  importMidsBuild: (build: Build) => void;
  resetBuild: () => void;
  clearPowers: () => void;

  // Hydration
  setHasHydrated: (value: boolean) => void;
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
  // Helper: sync power effects + icons from a powerset definition
  const syncPowers = (powers: SelectedPower[], defPowers: readonly Pick<SelectedPower, 'name' | 'effects' | 'icon'>[]): SelectedPower[] => {
    let anyChanged = false;
    const synced = powers.map((power) => {
      const currentDef = defPowers.find((p) => p.name === power.name);
      if (!currentDef) return power;
      const needsEffects = currentDef.effects && currentDef.effects !== power.effects;
      const needsIcon = currentDef.icon && currentDef.icon !== power.icon;
      if (needsEffects || needsIcon) {
        anyChanged = true;
        return {
          ...power,
          ...(needsEffects ? { effects: currentDef.effects } : {}),
          ...(needsIcon ? { icon: currentDef.icon } : {}),
        };
      }
      return power;
    });
    return anyChanged ? synced : powers;
  };

  // Sync primary powers
  if (build.primary.id && build.primary.powers.length > 0) {
    const def = getPowerset(build.primary.id);
    if (def) {
      const fixed = syncPowers(build.primary.powers, def.powers);
      if (fixed !== build.primary.powers) {
        build.primary = { ...build.primary, powers: fixed };
      }
    }
  }

  // Sync secondary powers
  if (build.secondary.id && build.secondary.powers.length > 0) {
    const def = getPowerset(build.secondary.id);
    if (def) {
      const fixed = syncPowers(build.secondary.powers, def.powers);
      if (fixed !== build.secondary.powers) {
        build.secondary = { ...build.secondary, powers: fixed };
      }
    }
  }

  // Sync pool powers
  if (build.pools.length > 0) {
    build.pools = build.pools.map((pool) => {
      const def = getPowerPool(pool.id);
      if (!def) return pool;
      const fixed = syncPowers(pool.powers, def.powers);
      return fixed !== pool.powers ? { ...pool, powers: fixed } : pool;
    });
  }

  // Sync epic pool powers
  if (build.epicPool && build.epicPool.powers.length > 0) {
    const def = getEpicPool(build.epicPool.id);
    if (def) {
      const fixed = syncPowers(build.epicPool.powers, def.powers);
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
}

/**
 * Find a power across all categories
 */
function findPower(
  build: Build,
  powerName: string
): { power: SelectedPower; category: PowerCategory } | null {
  // Check primary
  const primaryPower = build.primary.powers.find((p) => p.name === powerName);
  if (primaryPower) return { power: primaryPower, category: 'primary' };

  // Check secondary
  const secondaryPower = build.secondary.powers.find((p) => p.name === powerName);
  if (secondaryPower) return { power: secondaryPower, category: 'secondary' };

  // Check pools
  for (const pool of build.pools) {
    const poolPower = pool.powers.find((p) => p.name === powerName);
    if (poolPower) return { power: poolPower, category: 'pool' };
  }

  // Check epic pool
  if (build.epicPool) {
    const epicPower = build.epicPool.powers.find((p) => p.name === powerName);
    if (epicPower) return { power: epicPower, category: 'epic' };
  }

  // Check inherents
  const inherentPower = build.inherents.find((p) => p.name === powerName);
  if (inherentPower) return { power: inherentPower, category: 'inherent' };

  return null;
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
 * Check if a unique enhancement is already slotted anywhere in the build.
 * Also treats all pieces from purple, event, and archetype (ATO) sets as unique,
 * since the game enforces single-copy rules for these rarities.
 * @param build - The current build
 * @param setId - The IO set ID
 * @param pieceNum - The piece number within the set
 * @returns true if the enhancement is already slotted
 */
function isUniqueEnhancementSlotted(build: Build, setId: string, pieceNum: number): boolean {
  const checkSlots = (slots: (Enhancement | null)[]): boolean => {
    return slots.some((enh) => {
      if (!enh || enh.type !== 'io-set') return false;
      const ioEnh = enh as { setId: string; pieceNum: number };
      return ioEnh.setId === setId && ioEnh.pieceNum === pieceNum;
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

// Set tracking extracted to src/utils/calculations/set-tracking.ts
const updateSetTracking = computeSetTracking;

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
    (set, get) => ({
      // Initial state
      build: createEmptyBuild(),
      _hasHydrated: false,

      // Hydration tracking
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      // Build metadata
      setBuildName: (name) =>
        set((state) => ({
          build: { ...state.build, name },
        })),

      // Archetype
      setArchetype: (archetypeId) => {
        const archetype = getArchetype(archetypeId);
        if (!archetype) return;

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

      clearArchetype: () =>
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
        })),

      // Powersets
      setPrimary: (powersetId) => {
        const powerset = getPowerset(powersetId);
        if (!powerset) return;

        set((state) => {
          const newBuild = {
            ...state.build,
            primary: {
              id: powersetId,
              name: powerset.name,
              powers: [], // Clear powers when powerset changes
            },
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

        set((state) => {
          const newBuild = {
            ...state.build,
            secondary: {
              id: powersetId,
              name: powerset.name,
              powers: [],
            },
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
            const minLevel = (power.available ?? 0) + 1;
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

          // Default toggle/auto powers to active
          if ((power.powerType === 'Toggle' || power.powerType === 'Auto') && power.isActive === undefined) {
            power = { ...power, isActive: true };
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
          const formGroup = GRANTED_POWER_GROUPS[power.name];
          if (formGroup?.slottable && formGroup.grantedPowers.length > 0) {
            // Find the powerset definition to get full sub-power data
            const powersetId = power.powerSet;
            const powersetDef = powersetId ? getPowerset(powersetId) : null;
            if (powersetDef) {
              const subPowerDefs = powersetDef.powers.filter(p =>
                formGroup.grantedPowers.includes(p.name)
              );
              for (const subPowerDef of subPowerDefs) {
                const subPower: SelectedPower = {
                  ...subPowerDef,
                  powerSet: powersetId,
                  level: power.level,
                  slots: [null],
                  isAutoGranted: true,
                  grantedByPower: power.name,
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
        set((state) => {
          // Inherent: only allow removal of unlocked powers
          const updater = category === 'inherent'
            ? (powers: SelectedPower[]) => powers.filter((p) => p.name !== powerName || p.isLocked)
            : (powers: SelectedPower[]) => powers.filter((p) => p.name !== powerName);

          let newBuild = applyPowerUpdate(state.build, category, updater);

          // Also remove auto-granted sub-powers when removing a form power
          const formGroup = GRANTED_POWER_GROUPS[powerName];
          if (formGroup?.slottable && formGroup.grantedPowers.length > 0) {
            const subPowerNames = new Set(formGroup.grantedPowers);
            newBuild = applyPowerUpdate(newBuild, category, (powers) =>
              powers.filter((p) => !subPowerNames.has(p.name))
            );
          }

          // Keep the user's current level — don't rewind on removal
          // (addPower auto-advances but removePower should never lower it)

          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      movePowerLevel: (category, powerName, newLevel) => {
        set((state) => ({
          build: applyPowerUpdate(state.build, category, (powers) =>
            powers.map((p) => (p.name === powerName ? { ...p, level: newLevel } : p))
          ),
        }));
      },

      // Pools
      addPool: (poolId) => {
        const state = get();
        if (state.build.pools.length >= MAX_POWER_POOLS) return false;

        const pool = getPowerPool(poolId);
        if (!pool) return false;

        // Check if pool is already selected
        if (state.build.pools.some((p) => p.id === poolId)) return false;

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
        set((state) => {
          const newBuild = {
            ...state.build,
            pools: state.build.pools.filter((p) => p.id !== poolId),
          };
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      setEpicPool: (poolId) => {
        if (!poolId) {
          set((state) => {
            const newBuild = { ...state.build, epicPool: null };
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
      addSlot: (powerName) => {
        const state = get();
        const found = findPower(state.build, powerName);
        if (!found) return false;

        const { power, category } = found;

        // Check if power can have more slots
        if (power.slots.length >= power.maxSlots) return false;

        // Check total placed slot limit (level-aware)
        // Only count additional slots beyond each power's free first slot.
        // Inherent power slots are excluded entirely from the budget.
        if (countPlacedSlots(state.build) >= getPlacedSlotLimit(state.build.level)) return false;

        set((s) => ({
          build: applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.name === powerName ? { ...p, slots: [...p.slots, null] } : p
            )
          ),
        }));

        return true;
      },

      removeSlot: (powerName, slotIndex) => {
        const state = get();
        const found = findPower(state.build, powerName);
        if (!found) return false;

        const { power, category } = found;

        // Can't remove the first slot (it's free with the power)
        if (slotIndex === 0) return false;

        // Check if slot exists
        if (slotIndex >= power.slots.length) return false;

        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.name === powerName
                ? { ...p, slots: p.slots.filter((_, i) => i !== slotIndex) }
                : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });

        return true;
      },

      // Enhancements
      setEnhancement: (powerName, slotIndex, enhancement) => {
        const state = get();
        const found = findPower(state.build, powerName);
        if (!found) return;

        const { category } = found;

        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.name === powerName
                ? { ...p, slots: p.slots.map((slot, i) => (i === slotIndex ? enhancement : slot)) }
                : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      clearEnhancement: (powerName, slotIndex) => {
        get().setEnhancement(powerName, slotIndex, null as unknown as Enhancement);
      },

      clearAllEnhancements: (powerName) => {
        const state = get();
        const found = findPower(state.build, powerName);
        if (!found) return;

        const { category } = found;

        set((s) => {
          const newBuild = applyPowerUpdate(s.build, category, (powers) =>
            powers.map((p) =>
              p.name === powerName ? { ...p, slots: p.slots.map(() => null) } : p
            )
          );
          newBuild.sets = updateSetTracking(newBuild);
          return { build: newBuild };
        });
      },

      // Settings
      setLevel: (level) =>
        set((state) => ({
          build: {
            ...state.build,
            level: Math.max(1, Math.min(50, level)),
          },
        })),

      setExemplarLevel: (level) =>
        set((state) => ({
          build: {
            ...state.build,
            exemplarLevel: level ? Math.max(1, Math.min(state.build.level, level)) : null,
          },
        })),

      setProgressionMode: (mode) =>
        set((state) => ({
          build: { ...state.build, progressionMode: mode },
        })),

      setOrigin: (origin) =>
        set((state) => ({
          build: {
            ...state.build,
            settings: { ...state.build.settings, origin },
          },
        })),

      setGlobalIOLevel: (level) =>
        set((state) => ({
          build: {
            ...state.build,
            settings: {
              ...state.build.settings,
              globalIOLevel: Math.max(10, Math.min(53, level)),
            },
          },
        })),

      // Accolades
      addAccolade: (accolade) =>
        set((state) => ({
          build: {
            ...state.build,
            accolades: [...state.build.accolades, accolade],
          },
        })),

      removeAccolade: (accoladeId) =>
        set((state) => ({
          build: {
            ...state.build,
            accolades: state.build.accolades.filter((a) => a.id !== accoladeId),
          },
        })),

      // Incarnates
      setIncarnatePower: (slotId, power) =>
        set((state) => ({
          build: {
            ...state.build,
            incarnates: {
              ...state.build.incarnates,
              [slotId]: power,
            },
          },
        })),

      clearIncarnatePower: (slotId) =>
        set((state) => ({
          build: {
            ...state.build,
            incarnates: {
              ...state.build.incarnates,
              [slotId]: null,
            },
          },
        })),

      clearAllIncarnates: () =>
        set((state) => ({
          build: {
            ...state.build,
            incarnates: createEmptyIncarnateBuildState(),
          },
        })),

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
      togglePowerActive: (powerName) =>
        set((state) => ({
          build: applyToAllPowers(state.build, (powers) =>
            powers.map((p) =>
              p.name === powerName ? { ...p, isActive: !p.isActive } : p
            )
          ),
        })),

      // Set active sub-power for powers with mutually exclusive stances
      setActiveSubPower: (parentPowerName, subPowerName) =>
        set((state) => ({
          build: applyToAllPowers(state.build, (powers) =>
            powers.map((p) =>
              p.name === parentPowerName
                ? { ...p, activeSubPower: subPowerName ?? undefined }
                : p
            )
          ),
        })),

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

      canAddSlot: (powerName) => {
        const state = get();
        const found = findPower(state.build, powerName);
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

      // Import/Export
      exportBuild: () => {
        const { build } = get();
        const exportData = {
          version: 1,
          build: {
            ...build,
            // Convert Set to array for JSON serialization
            sets: Object.fromEntries(
              Object.entries(build.sets).map(([setId, tracking]) => [
                setId,
                { count: tracking.count, pieces: Array.from(tracking.pieces) },
              ])
            ),
          },
          meta: {
            exportedAt: new Date().toISOString(),
          },
        };
        return JSON.stringify(exportData, null, 2);
      },

      importBuild: (json) => {
        try {
          const data = JSON.parse(json);

          // Validate version
          if (data.version !== 1) {
            console.warn('Unknown build version:', data.version);
          }

          // Convert pieces arrays back to Sets
          const setsEntries = Object.entries(data.build.sets || {}) as [
            string,
            { count: number; pieces: number[] }
          ][];
          const build = {
            ...data.build,
            sets: Object.fromEntries(
              setsEntries.map(([setId, tracking]) => [
                setId,
                { count: tracking.count, pieces: new Set(tracking.pieces) },
              ])
            ),
          };

          // Sync power definitions (effects, icons) and enhancement icons
          // from current data — fixes stale data from older exports/shares
          syncBuildDefinitions(build);

          set({ build });
          return true;
        } catch (e) {
          console.error('Failed to import build:', e);
          return false;
        }
      },

      importMidsBuild: (build) => {
        set({ build });
      },

      resetBuild: () => set({ build: createEmptyBuild() }),

      clearPowers: () =>
        set((state) => ({
          build: {
            ...state.build,
            // Keep archetype, primary/secondary powerset selections
            // Clear all selected powers, pools, enhancements, etc.
            primary: {
              ...state.build.primary,
              powers: [],
            },
            secondary: {
              ...state.build.secondary,
              powers: [],
            },
            pools: [],
            epicPool: null,
            accolades: [],
            incarnates: createEmptyIncarnateBuildState(),
            craftingChecklist: createEmptyCraftingChecklistState(),
            sets: {},
            // Re-grant inherents with fresh empty slots
            inherents: getInherentSelectedPowers(
              state.build.archetype.id,
              state.build.archetype.name || undefined,
              state.build.archetype.inherent
            ),
          },
        })),
    }),
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
              const def = getInherentPowerDef(power.name);
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

          // Migration: Initialize shopping list acquired if missing
          if (!state.build.shoppingListAcquired) {
            state.build.shoppingListAcquired = {};
          }

          // Migration: Sync power definitions (effects, icons) and enhancement icons
          // from current data — fixes stale data from older builds
          syncBuildDefinitions(state.build);

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

            // Check if any non-inherent power has a level that isn't a valid pick level
            const pickLevelSet = new Set(POWER_PICK_LEVELS);
            const hasInvalidLevels = allPowers.some((entry) => !pickLevelSet.has(entry.power.level));

            if (hasInvalidLevels && allPowers.length > 0) {
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
