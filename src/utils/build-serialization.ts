/**
 * Build serialization — slim export (v2) and hydration
 *
 * The v2 format strips all derivable data (power definitions, enhancement details)
 * and keeps only build-specific selections. On import, full objects are reconstructed
 * from the app's data layer.
 */

import type {
  Build,
  SelectedPower,
  Enhancement,
  IOSetEnhancement,
  GenericIOEnhancement,
  SpecialEnhancement,
  OriginEnhancement,
  PoolSelection,
  Power,
  EnhancementStatType,
  EnhancementTier,
  SlimBuildData,
} from '@/types';
import { createEmptyIncarnateBuildState } from '@/types';
import {
  getArchetype,
  getPowerset,
  getPowerPool,
  getEpicPool,
  getIOSet,
  getInherentPowers,
  createArchetypeInherentPower,
  createIOSetEnhancement,
  createGenericIOEnhancement,
  createOriginEnhancement,
  createSpecialEnhancement,
  HAMIDON_ENHANCEMENTS,
  TITAN_ENHANCEMENTS,
  HYDRA_ENHANCEMENTS,
  DSYNC_ENHANCEMENTS,
} from '@/data';
import type { InherentPowerDef } from '@/data';

// ============================================
// SLIM TYPES (exported for BuildExport typing)
// ============================================

export type SlimEnhancement =
  | { type: 'io-set'; setId: string; pieceNum: number; attuned?: boolean; level?: number; boost?: number }
  | { type: 'io-generic'; stat: string; level: number; boost?: number }
  | { type: 'special'; id: string; category: string; boost?: number }
  | { type: 'origin'; stat: string; tier: string; boost?: number };

export interface SlimPower {
  name: string;
  level: number;
  slots: (SlimEnhancement | null)[];
  isActive?: boolean;
  activeSubPower?: string;
  isAutoGranted?: boolean;
  grantedByPower?: string;
}

export interface SlimPowersetSelection {
  id: string | null;
  name: string;
  powers: SlimPower[];
}

export interface SlimPoolSelection {
  id: string;
  name: string;
  powers: SlimPower[];
}

// ============================================
// EXPORT: Build → Slim
// ============================================

/**
 * Strip a full Build to slim format for JSON export.
 * Returns a plain object ready for JSON.stringify.
 */
export function slimBuild(build: Build): SlimBuildData {
  return {
    name: build.name,
    archetype: { id: build.archetype.id, name: build.archetype.name },
    level: build.level,
    exemplarLevel: build.exemplarLevel,
    progressionMode: build.progressionMode,
    primary: slimPowersetSelection(build.primary),
    secondary: slimPowersetSelection(build.secondary),
    pools: build.pools.map(slimPoolSelection),
    epicPool: build.epicPool ? slimPoolSelection(build.epicPool) : null,
    inherents: slimInherents(build.inherents),
    accolades: build.accolades,
    settings: build.settings,
    sets: Object.fromEntries(
      Object.entries(build.sets).map(([setId, tracking]) => [
        setId,
        { count: tracking.count, pieces: Array.from(tracking.pieces) },
      ])
    ),
    incarnates: build.incarnates,
    craftingChecklist: build.craftingChecklist,
    shoppingListAcquired: build.shoppingListAcquired,
    slotOrder: build.slotOrder,
  };
}

function slimPowersetSelection(ps: { id: string | null; name: string; powers: SelectedPower[] }): SlimPowersetSelection {
  return {
    id: ps.id,
    name: ps.name,
    powers: ps.powers.map(slimPower),
  };
}

function slimPoolSelection(pool: PoolSelection): SlimPoolSelection {
  return {
    id: pool.id,
    name: pool.name,
    powers: pool.powers.map(slimPower),
  };
}

function slimPower(power: SelectedPower): SlimPower {
  const slim: SlimPower = {
    name: power.name,
    level: power.level,
    slots: power.slots.map((slot) => (slot ? slimEnhancement(slot) : null)),
  };
  if (power.isActive !== undefined) slim.isActive = power.isActive;
  if (power.activeSubPower) slim.activeSubPower = power.activeSubPower;
  if (power.isAutoGranted) slim.isAutoGranted = power.isAutoGranted;
  if (power.grantedByPower) slim.grantedByPower = power.grantedByPower;
  return slim;
}

function slimEnhancement(enh: Enhancement): SlimEnhancement {
  switch (enh.type) {
    case 'io-set': {
      const e = enh as IOSetEnhancement;
      const slim: SlimEnhancement = { type: 'io-set', setId: e.setId, pieceNum: e.pieceNum };
      if (e.attuned) slim.attuned = true;
      if (e.level !== undefined) slim.level = e.level;
      if (e.boost) slim.boost = e.boost;
      return slim;
    }
    case 'io-generic': {
      const e = enh as GenericIOEnhancement;
      const slim: SlimEnhancement = { type: 'io-generic', stat: e.stat, level: e.level! };
      if (e.boost) slim.boost = e.boost;
      return slim;
    }
    case 'special': {
      const e = enh as SpecialEnhancement;
      // id is "category-registryId", extract registryId
      const registryId = e.id.startsWith(`${e.category}-`)
        ? e.id.slice(e.category.length + 1)
        : e.id;
      const slim: SlimEnhancement = { type: 'special', id: registryId, category: e.category };
      if (e.boost) slim.boost = e.boost;
      return slim;
    }
    case 'origin': {
      const e = enh as OriginEnhancement;
      const slim: SlimEnhancement = { type: 'origin', stat: e.stat, tier: e.tier };
      if (e.boost) slim.boost = e.boost;
      return slim;
    }
  }
}

/**
 * Include inherents that have been modified from their default state:
 * either they have a slotted enhancement, or they have extra slots placed
 * (even if empty — the user has allocated slot picks to them).
 */
function slimInherents(inherents: SelectedPower[]): SlimPower[] {
  return inherents
    .filter((p) => p.slots.some((s) => s !== null) || p.slots.length > 1)
    .map(slimPower);
}

// ============================================
// IMPORT: Slim → Build (hydration)
// ============================================

const SPECIAL_REGISTRIES = {
  'hamidon': HAMIDON_ENHANCEMENTS,
  'titan': TITAN_ENHANCEMENTS,
  'hydra': HYDRA_ENHANCEMENTS,
  'd-sync': DSYNC_ENHANCEMENTS,
} as const;

/**
 * Reconstruct a full Build from a v2 slim export.
 */
export function hydrateBuild(slim: Record<string, any>): Build {
  // Archetype
  const archetypeId = slim.archetype?.id ?? null;
  const archetype = archetypeId ? getArchetype(archetypeId) : null;

  const archetypeSelection = {
    id: archetypeId,
    name: archetype?.name ?? '',
    stats: archetype?.stats ?? null,
    inherent: archetype?.inherent ?? null,
  };

  // Primary powerset
  const primaryId = slim.primary?.id ?? null;
  const primaryDef = primaryId ? getPowerset(primaryId) : null;
  const primaryPowers = hydratePowers(slim.primary?.powers ?? [], primaryDef?.powers ?? [], primaryId ?? '');

  // Secondary powerset
  const secondaryId = slim.secondary?.id ?? null;
  const secondaryDef = secondaryId ? getPowerset(secondaryId) : null;
  const secondaryPowers = hydratePowers(slim.secondary?.powers ?? [], secondaryDef?.powers ?? [], secondaryId ?? '');

  // Pools
  const pools: PoolSelection[] = (slim.pools ?? []).map((slimPool: SlimPoolSelection) => {
    const poolDef = getPowerPool(slimPool.id);
    return {
      id: slimPool.id,
      name: poolDef?.name ?? slimPool.id,
      powers: hydratePowers(slimPool.powers, poolDef?.powers ?? [], slimPool.id),
    };
  });

  // Epic pool
  let epicPool: PoolSelection | null = null;
  if (slim.epicPool) {
    const epicDef = getEpicPool(slim.epicPool.id);
    epicPool = {
      id: slim.epicPool.id,
      name: epicDef?.name ?? slim.epicPool.id,
      powers: hydratePowers(slim.epicPool.powers, epicDef?.powers ?? [], slim.epicPool.id),
    };
  }

  // Inherent powers — auto-populate, then merge slot data from slim
  const inherents = getInherentSelectedPowers(
    archetypeSelection.name,
    archetypeSelection.inherent,
  );
  const slimInherents: SlimPower[] = slim.inherents ?? [];
  for (const slimInh of slimInherents) {
    const match = inherents.find(
      (inh) => inh.name.toLowerCase() === slimInh.name.toLowerCase()
    );
    if (match && slimInh.slots.length > 0) {
      match.slots = slimInh.slots.map((s: SlimEnhancement | null) =>
        s ? hydrateEnhancement(s) : null
      );
    }
  }

  // Sets — convert pieces arrays back to Sets
  const setsEntries = Object.entries(slim.sets || {}) as [
    string,
    { count: number; pieces: number[] }
  ][];
  const sets = Object.fromEntries(
    setsEntries.map(([setId, tracking]) => [
      setId,
      { count: tracking.count, pieces: new Set(tracking.pieces) },
    ])
  );

  return {
    name: slim.name ?? 'Imported Build',
    archetype: archetypeSelection,
    level: slim.level ?? 50,
    exemplarLevel: slim.exemplarLevel ?? null,
    progressionMode: slim.progressionMode ?? 'auto',
    primary: {
      id: primaryId,
      name: primaryDef?.name ?? '',
      powers: primaryPowers,
    },
    secondary: {
      id: secondaryId,
      name: secondaryDef?.name ?? '',
      powers: secondaryPowers,
    },
    pools,
    epicPool,
    inherents,
    accolades: slim.accolades ?? [],
    settings: slim.settings ?? { globalIOLevel: 50, origin: 'Natural' },
    sets,
    incarnates: slim.incarnates ?? createEmptyIncarnateBuildState(),
    craftingChecklist: slim.craftingChecklist ?? {},
    shoppingListAcquired: slim.shoppingListAcquired ?? {},
    slotOrder: slim.slotOrder ?? [],
  };
}

/**
 * Hydrate an array of slim powers by matching against powerset definitions.
 */
function hydratePowers(slimPowers: SlimPower[], powerDefs: readonly Power[], powerSetId: string): SelectedPower[] {
  return slimPowers.map((slim) => {
    // Find the matching power definition
    const def = powerDefs.find(
      (p) => p.name.toLowerCase() === slim.name.toLowerCase()
    );

    // Hydrate enhancement slots
    const slots: (Enhancement | null)[] = slim.slots.map(
      (s: SlimEnhancement | null) => (s ? hydrateEnhancement(s) : null)
    );

    // Ensure at least one slot
    if (slots.length === 0) slots.push(null);

    if (def) {
      // Full reconstruction: spread power definition, overlay build-specific fields
      return {
        ...def,
        powerSet: powerSetId,
        level: slim.level,
        slots,
        ...(slim.isActive !== undefined ? { isActive: slim.isActive } : {}),
        ...(slim.activeSubPower ? { activeSubPower: slim.activeSubPower } : {}),
        ...(slim.isAutoGranted ? { isAutoGranted: slim.isAutoGranted } : {}),
        ...(slim.grantedByPower ? { grantedByPower: slim.grantedByPower } : {}),
      } as SelectedPower;
    }

    // Fallback: minimal SelectedPower when definition not found
    return {
      name: slim.name,
      powerSet: powerSetId,
      level: slim.level,
      available: 0,
      maxSlots: 6,
      slots,
      allowedEnhancements: [],
      description: '',
      powerType: 'Click' as const,
      effects: {},
      ...(slim.isActive !== undefined ? { isActive: slim.isActive } : {}),
      ...(slim.activeSubPower ? { activeSubPower: slim.activeSubPower } : {}),
      ...(slim.isAutoGranted ? { isAutoGranted: slim.isAutoGranted } : {}),
      ...(slim.grantedByPower ? { grantedByPower: slim.grantedByPower } : {}),
    } as SelectedPower;
  });
}

/**
 * Reconstruct a full Enhancement from slim data.
 */
function hydrateEnhancement(slim: SlimEnhancement): Enhancement | null {
  switch (slim.type) {
    case 'io-set': {
      const ioSet = getIOSet(slim.setId);
      if (!ioSet) return null;
      const piece = ioSet.pieces.find((p) => p.num === slim.pieceNum);
      if (!piece) return null;
      return createIOSetEnhancement(ioSet, piece, slim.pieceNum - 1, {
        attuned: slim.attuned ?? false,
        level: slim.level ?? 50,
        boost: slim.boost,
      });
    }
    case 'io-generic': {
      return createGenericIOEnhancement(
        slim.stat as EnhancementStatType,
        slim.level,
        slim.boost,
      );
    }
    case 'special': {
      const category = slim.category as keyof typeof SPECIAL_REGISTRIES;
      const registry = SPECIAL_REGISTRIES[category];
      if (!registry) return null;
      const def = registry[slim.id];
      if (!def) return null;
      return createSpecialEnhancement(slim.id, def, category, slim.boost);
    }
    case 'origin': {
      return createOriginEnhancement(
        slim.stat as EnhancementStatType,
        slim.tier as EnhancementTier,
        undefined,
        slim.boost,
      );
    }
    default:
      return null;
  }
}

// ============================================
// INHERENT POWER HELPERS (mirrors importer.ts)
// ============================================

function createInherentSelectedPower(def: InherentPowerDef): SelectedPower {
  const slots: (Enhancement | null)[] = def.maxSlots === 0 ? [] : [null];
  return {
    ...def,
    powerSet: 'Inherent',
    level: 1,
    slots,
    isLocked: def.isLocked ?? true,
    inherentCategory: def.category,
  };
}

function getInherentSelectedPowers(
  archetypeName: string,
  archetypeInherent: { name: string; description: string } | null,
): SelectedPower[] {
  const powers = getInherentPowers().map(createInherentSelectedPower);
  if (archetypeName && archetypeInherent) {
    const atInherentDef = createArchetypeInherentPower(archetypeName, archetypeInherent);
    powers.unshift(createInherentSelectedPower(atInherentDef));
  }
  return powers;
}
