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
  SetTracking,
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
  getPowerPicksAtLevel,
  MAX_POWER_POOLS,
  MAX_POWER_PICKS,
  EPIC_POOL_LEVEL,
  getInherentPowers,
  getInherentPowerDef,
  createArchetypeInherentPower,
  POWER_PICK_LEVELS,
  getIOSet,
} from '@/data';
import type { InherentPowerDef } from '@/data';

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

/**
 * Update IO set tracking when an enhancement changes
 */
function updateSetTracking(build: Build): Record<string, SetTracking> {
  const sets: Record<string, SetTracking> = {};

  const processSlots = (slots: (Enhancement | null)[]) => {
    for (const enh of slots) {
      if (enh && enh.type === 'io-set') {
        const setId = (enh as { setId: string }).setId;
        const pieceNum = (enh as { pieceNum: number }).pieceNum;

        if (!sets[setId]) {
          sets[setId] = { count: 0, pieces: new Set() };
        }

        if (!sets[setId].pieces.has(pieceNum)) {
          sets[setId].pieces.add(pieceNum);
          sets[setId].count++;
        }
      }
    }
  };

  // Process all power categories
  build.primary.powers.forEach((p) => processSlots(p.slots));
  build.secondary.powers.forEach((p) => processSlots(p.slots));
  build.pools.forEach((pool) => pool.powers.forEach((p) => processSlots(p.slots)));
  if (build.epicPool) {
    build.epicPool.powers.forEach((p) => processSlots(p.slots));
  }
  build.inherents.forEach((p) => processSlots(p.slots));

  return sets;
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

  return {
    ...def,
    powerSet: 'Inherent',
    level: 1, // All inherents are granted at level 1
    slots,
    isLocked: def.isLocked ?? true, // All inherent powers are locked by default
    inherentCategory: def.category,
  };
}

/**
 * Get all inherent powers as SelectedPower objects
 * @param archetypeName - The archetype name for the archetype-specific inherent
 * @param archetypeInherent - The archetype's inherent power definition
 */
function getInherentSelectedPowers(
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

  return powers;
}

/**
 * Count total selected powers (excluding inherents)
 */
function countSelectedPowers(build: Build): number {
  return (
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum, pool) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0)
  );
}

/**
 * Calculate the correct build level based on the current number of selected powers.
 * Works bidirectionally — advances when powers are added, rewinds when removed.
 */
function calculateCorrectLevel(build: Build): number {
  const totalPowers = countSelectedPowers(build);

  // Level 1 special: need both a primary and secondary power before advancing
  const hasPrimary = build.primary.powers.length >= 1;
  const hasSecondary = build.secondary.powers.length >= 1;
  if (!hasPrimary || !hasSecondary) {
    return 1;
  }

  // Find the first power pick level where available picks exceed current count.
  // That level still has an open slot, so the cursor belongs there.
  for (const level of POWER_PICK_LEVELS) {
    if (getPowerPicksAtLevel(level) > totalPowers) {
      return level;
    }
  }

  // All 24 picks used — stay at the last pick level
  return POWER_PICK_LEVELS[POWER_PICK_LEVELS.length - 1];
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

          // Always use the CURRENT store level, not the potentially stale level
          // passed from the component closure. This prevents two powers getting
          // the same level when the user clicks rapidly between renders.
          if (category !== 'inherent') {
            power = { ...power, level: state.build.level };
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

          const newBuild = applyPowerUpdate(state.build, category, updater);

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
            // Keep inherents (they're based on archetype, not user-selected powers)
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

          // Migration: Refresh primary/secondary power effects from current definitions
          // Stored powers may have stale/missing effects if powerset data was updated
          if (state.build.primary.id && state.build.primary.powers.length > 0) {
            const primaryDef = getPowerset(state.build.primary.id);
            if (primaryDef) {
              state.build.primary = {
                ...state.build.primary,
                powers: state.build.primary.powers.map((power) => {
                  const currentDef = primaryDef.powers.find((p) => p.name === power.name);
                  if (currentDef?.effects) {
                    return { ...power, effects: currentDef.effects };
                  }
                  return power;
                }),
              };
            }
          }
          if (state.build.secondary.id && state.build.secondary.powers.length > 0) {
            const secondaryDef = getPowerset(state.build.secondary.id);
            if (secondaryDef) {
              state.build.secondary = {
                ...state.build.secondary,
                powers: state.build.secondary.powers.map((power) => {
                  const currentDef = secondaryDef.powers.find((p) => p.name === power.name);
                  if (currentDef?.effects) {
                    return { ...power, effects: currentDef.effects };
                  }
                  return power;
                }),
              };
            }
          }

          // Migration: Refresh pool power effects from current definitions
          // Stored powers may have stale/missing effects if pool data was updated
          if (state.build.pools.length > 0) {
            state.build.pools = state.build.pools.map((pool) => {
              const poolDef = getPowerPool(pool.id);
              if (!poolDef) return pool;
              return {
                ...pool,
                powers: pool.powers.map((power) => {
                  const currentDef = poolDef.powers.find((p) => p.name === power.name);
                  if (currentDef?.effects) {
                    return { ...power, effects: currentDef.effects };
                  }
                  return power;
                }),
              };
            });
          }

          // Migration: Refresh epic pool power effects from current definitions
          if (state.build.epicPool && state.build.epicPool.powers.length > 0) {
            const epicDef = getEpicPool(state.build.epicPool.id);
            if (epicDef) {
              state.build.epicPool = {
                ...state.build.epicPool,
                powers: state.build.epicPool.powers.map((power) => {
                  const currentDef = epicDef.powers.find((p) => p.name === power.name);
                  if (currentDef?.effects) {
                    return { ...power, effects: currentDef.effects };
                  }
                  return power;
                }),
              };
            }
          }

          // Migration: Sync IO set enhancement icons from current data
          // Fixes enhancements with stale or missing icon names from older builds
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

          if (state.build.primary.powers.length > 0) {
            const fixed = fixEnhancementIcons(state.build.primary.powers);
            if (fixed !== state.build.primary.powers) {
              state.build.primary = { ...state.build.primary, powers: fixed };
            }
          }
          if (state.build.secondary.powers.length > 0) {
            const fixed = fixEnhancementIcons(state.build.secondary.powers);
            if (fixed !== state.build.secondary.powers) {
              state.build.secondary = { ...state.build.secondary, powers: fixed };
            }
          }
          if (state.build.pools.length > 0) {
            state.build.pools = state.build.pools.map((pool) => {
              const fixed = fixEnhancementIcons(pool.powers);
              return fixed !== pool.powers ? { ...pool, powers: fixed } : pool;
            });
          }
          if (state.build.epicPool && state.build.epicPool.powers.length > 0) {
            const fixed = fixEnhancementIcons(state.build.epicPool.powers);
            if (fixed !== state.build.epicPool.powers) {
              state.build.epicPool = { ...state.build.epicPool, powers: fixed };
            }
          }
          if (state.build.inherents && state.build.inherents.length > 0) {
            const fixed = fixEnhancementIcons(state.build.inherents);
            if (fixed !== state.build.inherents) {
              state.build.inherents = fixed;
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
