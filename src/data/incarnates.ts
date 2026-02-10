/**
 * Incarnate System Data Layer
 *
 * Provides access to incarnate slot definitions, trees, and powers.
 * Data is loaded from the raw JSON files in incarnate_raw_data/
 */

import { resolvePath } from '@/utils/paths';
import type {
  IncarnateSlotId,
  IncarnateTier,
  IncarnateSlotDefinition,
  IncarnateTree,
  IncarnatePower,
} from '@/types';
import {
  INCARNATE_SLOT_ORDER,
  inferTierFromPowerName,
  inferBranchFromPowerName,
} from '@/types';
import {
  getSlotColor,
  getSlotIconFolder,
  getTreeDescription,
} from './incarnate-registry';

// ============================================
// RAW DATA IMPORTS
// ============================================

// Import slot index files
import alphaIndex from '../../incarnate_raw_data/alpha/index.json';
import judgementIndex from '../../incarnate_raw_data/judgement/index.json';
import interfaceIndex from '../../incarnate_raw_data/interface/index.json';
import destinyIndex from '../../incarnate_raw_data/destiny/index.json';
import loreIndex from '../../incarnate_raw_data/lore/index.json';
import hybridIndex from '../../incarnate_raw_data/hybrid/index.json';

// Type for raw slot index
interface RawSlotIndex {
  name: string;
  display_name: string;
  icon: string;
  power_names: string[];
  power_display_names: string[];
  power_short_helps: string[];
}

// Map slot IDs to their raw data
const RAW_SLOT_INDICES: Record<IncarnateSlotId, RawSlotIndex> = {
  alpha: alphaIndex as RawSlotIndex,
  judgement: judgementIndex as RawSlotIndex,
  interface: interfaceIndex as RawSlotIndex,
  destiny: destinyIndex as RawSlotIndex,
  lore: loreIndex as RawSlotIndex,
  hybrid: hybridIndex as RawSlotIndex,
};


// ============================================
// DATA PROCESSING
// ============================================

/**
 * Parse a power full name to extract tree and power info
 * e.g., "Incarnate.Alpha.Musculature_Core_Paragon" -> { tree: "musculature", name: "Core Paragon" }
 */
function parsePowerName(fullName: string): { tree: string; powerName: string } {
  const parts = fullName.split('.');
  const lastPart = parts[parts.length - 1]; // e.g., "Musculature_Core_Paragon"
  const underscoreParts = lastPart.split('_');
  const tree = underscoreParts[0].toLowerCase();
  const powerName = underscoreParts.slice(1).join('_');
  return { tree, powerName };
}

/**
 * Get icon filename from power display name and tier
 */
function getIconFromTier(slotId: IncarnateSlotId, treeId: string, tier: IncarnateTier): string {
  const tierSuffix = tier === 'common' ? 'common' :
                     tier === 'uncommon' ? 'uncommon' :
                     tier === 'rare' ? 'rare' : 'veryrare';
  return `incarnate_${slotId}_${treeId}_${tierSuffix}.png`;
}

/**
 * Build the slot definition from raw data
 */
function buildSlotDefinition(slotId: IncarnateSlotId): IncarnateSlotDefinition {
  const raw = RAW_SLOT_INDICES[slotId];
  const treeMap = new Map<string, IncarnatePower[]>();

  // Process each power
  for (let i = 0; i < raw.power_names.length; i++) {
    const fullName = raw.power_names[i];
    const displayName = raw.power_display_names[i];
    const shortHelp = raw.power_short_helps?.[i] || '';

    const { tree } = parsePowerName(fullName);
    const tier = inferTierFromPowerName(displayName);
    const branch = inferBranchFromPowerName(displayName);
    const icon = getIconFromTier(slotId, tree, tier);

    const power: IncarnatePower = {
      id: fullName.split('.').pop()?.toLowerCase() || '',
      fullName,
      displayName,
      shortHelp,
      displayHelp: shortHelp, // Will be loaded on demand from individual power files
      icon,
      tier,
      branch,
      treeId: tree,
      slotId,
      powerType: 'Auto', // Most incarnate powers are auto
    };

    if (!treeMap.has(tree)) {
      treeMap.set(tree, []);
    }
    treeMap.get(tree)!.push(power);
  }

  // Build trees from the map
  const trees: IncarnateTree[] = [];
  for (const [treeId, powers] of treeMap) {
    trees.push({
      id: treeId,
      name: treeId.charAt(0).toUpperCase() + treeId.slice(1),
      description: getTreeDescription(slotId, treeId),
      powers: powers.sort((a, b) => {
        // Sort by tier, then by branch
        const tierOrder = ['common', 'uncommon', 'rare', 'veryrare'];
        const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
        if (tierDiff !== 0) return tierDiff;

        const branchOrder = ['base', 'core', 'radial'];
        return branchOrder.indexOf(a.branch) - branchOrder.indexOf(b.branch);
      }),
    });
  }

  // Sort trees alphabetically
  trees.sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: slotId,
    name: raw.name,
    displayName: raw.display_name,
    icon: raw.icon,
    color: getSlotColor(slotId),
    trees,
  };
}

// ============================================
// CACHED DATA
// ============================================

let _slotDefinitions: IncarnateSlotDefinition[] | null = null;
let _slotMap: Map<IncarnateSlotId, IncarnateSlotDefinition> | null = null;

function ensureDataLoaded(): void {
  if (_slotDefinitions === null) {
    _slotDefinitions = INCARNATE_SLOT_ORDER.map(buildSlotDefinition);
    _slotMap = new Map(_slotDefinitions.map(s => [s.id, s]));
  }
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Get all incarnate slot definitions
 */
export function getAllIncarnateSlots(): IncarnateSlotDefinition[] {
  ensureDataLoaded();
  return _slotDefinitions!;
}

/**
 * Get a specific incarnate slot definition
 */
export function getIncarnateSlot(slotId: IncarnateSlotId): IncarnateSlotDefinition | undefined {
  ensureDataLoaded();
  return _slotMap!.get(slotId);
}

/**
 * Get all trees for a slot
 */
export function getIncarnateTrees(slotId: IncarnateSlotId): IncarnateTree[] {
  const slot = getIncarnateSlot(slotId);
  return slot?.trees || [];
}

/**
 * Get a specific tree within a slot
 */
export function getIncarnateTree(slotId: IncarnateSlotId, treeId: string): IncarnateTree | undefined {
  const trees = getIncarnateTrees(slotId);
  return trees.find(t => t.id === treeId);
}

/**
 * Get all powers for a tree
 */
export function getIncarnatePowersForTree(slotId: IncarnateSlotId, treeId: string): IncarnatePower[] {
  const tree = getIncarnateTree(slotId, treeId);
  return tree?.powers || [];
}

/**
 * Get powers by tier for a tree
 */
export function getIncarnatePowersByTier(
  slotId: IncarnateSlotId,
  treeId: string,
  tier: IncarnateTier
): IncarnatePower[] {
  const powers = getIncarnatePowersForTree(slotId, treeId);
  return powers.filter(p => p.tier === tier);
}

/**
 * Find a specific power by ID
 */
export function getIncarnatePower(
  slotId: IncarnateSlotId,
  powerId: string
): IncarnatePower | undefined {
  const slot = getIncarnateSlot(slotId);
  if (!slot) return undefined;

  for (const tree of slot.trees) {
    const power = tree.powers.find(p => p.id === powerId || p.fullName === powerId);
    if (power) return power;
  }

  return undefined;
}

/**
 * Get the icon path for an incarnate power icon
 */
export function getIncarnateIconPath(slotId: IncarnateSlotId, icon: string): string {
  const folder = getSlotIconFolder(slotId);
  // Convert to lowercase for file matching
  const lowerIcon = icon.toLowerCase();
  return resolvePath(`/img/Powers/${folder}/${lowerIcon}`);
}

/**
 * Get the slot icon path (uses the blank/empty slot icon)
 */
export function getIncarnateSlotIconPath(slotId: IncarnateSlotId): string {
  const folder = getSlotIconFolder(slotId);
  // Use the blank icon as the slot placeholder
  return resolvePath(`/img/Powers/${folder}/incarnate_${slotId}_blank.png`);
}
