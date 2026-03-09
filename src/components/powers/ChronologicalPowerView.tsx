/**
 * ChronologicalPowerView - Mids Reborn-style power display by level taken
 *
 * Displays powers in a 3-column grid organized by the level they were taken,
 * rather than by powerset category. Supports drag-and-swap to reorder powers.
 */

import { useState, useMemo, useCallback } from 'react';
import { useBuildStore } from '@/stores';
import type { SelectedPower } from '@/types';
import { ChronologicalPowerSlot } from './ChronologicalPowerSlot';
import { ChronologicalInherentsSection } from './ChronologicalInherentsSection';

// Power category for color coding
export type PowerCategory = 'primary' | 'secondary' | 'pool' | 'epic';

// Extended power type with category info
export interface CategorizedPower extends SelectedPower {
  category: PowerCategory;
  poolName?: string; // For pool powers, the pool name
}

// Drag state shared across all slots during a drag operation
export interface DragState {
  draggedPower: CategorizedPower;
  validTargets: Set<string>;
}

// Slot key type for the pre-computed assignments
type SlotKey = string; // Format: "columnIndex-slotIndex" e.g., "0-0", "0-1", "1-0"

// Slot position info used for validation
interface SlotInfo {
  key: string;
  level: number;
  slotIndex: number;
  columnIndex: number;
}

// Column definitions using actual game power pick levels
// Level 1 has 2 picks (primary + secondary), so it appears twice in Column A
const COLUMN_A_LEVELS = [1, 1, 2, 4, 6, 8, 10, 12]; // 8 slots
const COLUMN_B_LEVELS = [14, 16, 18, 20, 22, 24, 26, 28]; // 8 slots
const COLUMN_C_LEVELS = [30, 32, 35, 38, 41, 44, 47, 49]; // 8 slots

const ALL_COLUMNS = [
  { index: 0, title: 'Levels 1-12', levels: COLUMN_A_LEVELS },
  { index: 1, title: 'Levels 14-28', levels: COLUMN_B_LEVELS },
  { index: 2, title: 'Levels 30-49', levels: COLUMN_C_LEVELS },
];

// Pre-computed flat list of all 24 slot positions (stable reference)
const ALL_SLOTS: SlotInfo[] = ALL_COLUMNS.flatMap((column) =>
  column.levels.map((level, slotIndex) => ({
    key: `${column.index}-${slotIndex}`,
    level,
    slotIndex,
    columnIndex: column.index,
  }))
);

/**
 * Compute which slots are valid drop targets for the dragged power.
 *
 * Rules:
 * - Empty slot: dragged power's min level <= slot level
 * - Occupied slot (swap): BOTH powers satisfy their min level after swap
 * - Level 1 slot 0 must hold a primary, slot 1 must hold a secondary
 * - Can't drop on self
 */
function computeValidTargets(
  draggedPower: CategorizedPower,
  slotAssignments: Map<SlotKey, CategorizedPower>,
): Set<string> {
  const valid = new Set<string>();
  const dragMinLevel = (draggedPower.available ?? 0) + 1;

  for (const slot of ALL_SLOTS) {
    const occupant = slotAssignments.get(slot.key);

    // Can't drop on self
    if (occupant && occupant.name === draggedPower.name) continue;

    if (!occupant) {
      // Empty slot: dragged power must be allowed at this level
      if (slot.level < dragMinLevel) continue;
      // Level 1 category enforcement
      if (slot.level === 1 && slot.slotIndex === 0 && draggedPower.category !== 'primary') continue;
      if (slot.level === 1 && slot.slotIndex === 1 && draggedPower.category !== 'secondary') continue;
      valid.add(slot.key);
    } else {
      // Swap: both powers must satisfy their min level after the swap
      const occupantMinLevel = (occupant.available ?? 0) + 1;
      const draggedNewLevel = slot.level;
      const occupantNewLevel = draggedPower.level;

      if (draggedNewLevel < dragMinLevel || occupantNewLevel < occupantMinLevel) continue;

      // Level 1 category enforcement for the swap destination
      if (draggedNewLevel === 1 && slot.slotIndex === 0 && draggedPower.category !== 'primary') continue;
      if (draggedNewLevel === 1 && slot.slotIndex === 1 && draggedPower.category !== 'secondary') continue;

      // Level 1 category enforcement for where the occupant would go
      if (occupantNewLevel === 1) {
        // Find the dragged power's original slot to check which L1 position it occupies
        const draggedSlot = ALL_SLOTS.find(
          (s) => slotAssignments.get(s.key)?.name === draggedPower.name
        );
        if (draggedSlot) {
          if (draggedSlot.slotIndex === 0 && draggedSlot.level === 1 && occupant.category !== 'primary') continue;
          if (draggedSlot.slotIndex === 1 && draggedSlot.level === 1 && occupant.category !== 'secondary') continue;
        }
      }

      valid.add(slot.key);
    }
  }

  return valid;
}

/**
 * Hook to collect, organize, and pre-assign all selected powers to slots.
 * Sorts all powers by level then assigns sequentially to the 24 slots,
 * so even if stored levels have gaps or duplicates (from remove/re-add),
 * every power gets a slot.
 */
function useChronologicalPowers() {
  const build = useBuildStore((s) => s.build);

  return useMemo(() => {
    const allPowers: CategorizedPower[] = [];

    // Collect primary powers (exclude auto-granted form sub-powers)
    build.primary.powers.filter(p => !p.isAutoGranted).forEach((p) => {
      allPowers.push({ ...p, category: 'primary' });
    });

    // Collect secondary powers (exclude auto-granted form sub-powers)
    build.secondary.powers.filter(p => !p.isAutoGranted).forEach((p) => {
      allPowers.push({ ...p, category: 'secondary' });
    });

    // Collect pool powers
    build.pools.forEach((pool) => {
      pool.powers.forEach((p) => {
        allPowers.push({ ...p, category: 'pool', poolName: pool.name });
      });
    });

    // Collect epic/patron powers
    if (build.epicPool) {
      build.epicPool.powers.forEach((p) => {
        allPowers.push({ ...p, category: 'epic', poolName: build.epicPool?.name });
      });
    }

    // Sort all powers by level, then by category for ties (primary before secondary)
    const categoryOrder: PowerCategory[] = ['primary', 'secondary', 'pool', 'epic'];
    allPowers.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    });

    // Build the slot assignments map
    const slotAssignments = new Map<SlotKey, CategorizedPower>();

    // Place each power at the slot matching its assigned level.
    // Powers are sorted by level, so earlier powers claim slots first.
    const usedSlots = new Set<string>();
    for (const power of allPowers) {
      // Find the first unoccupied slot at this power's assigned level
      let placed = false;
      for (const slot of ALL_SLOTS) {
        if (slot.level === power.level && !usedSlots.has(slot.key)) {
          slotAssignments.set(slot.key, power);
          usedSlots.add(slot.key);
          placed = true;
          break;
        }
      }
      // Fallback: if no exact level match (legacy builds), find nearest available slot
      if (!placed) {
        for (const slot of ALL_SLOTS) {
          if (slot.level >= power.level && !usedSlots.has(slot.key)) {
            slotAssignments.set(slot.key, power);
            usedSlots.add(slot.key);
            break;
          }
        }
      }
    }

    return {
      slotAssignments,
      inherents: build.inherents,
      totalPowers: allPowers.length,
    };
  }, [build]);
}

interface ColumnProps {
  columnIndex: number;
  title: string;
  levels: number[];
  slotAssignments: Map<SlotKey, CategorizedPower>;
  dragState: DragState | null;
  onDragStart: (power: CategorizedPower) => void;
  onDragEnd: () => void;
}

function PowerColumn({ columnIndex, title, levels, slotAssignments, dragState, onDragStart, onDragEnd }: ColumnProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1 py-1 border-b border-slate-700">
        {title}
      </div>
      <div className="flex flex-col gap-1 p-1">
        {levels.map((level, slotIndex) => {
          const slotKey = `${columnIndex}-${slotIndex}`;
          const power = slotAssignments.get(slotKey) || null;

          return (
            <ChronologicalPowerSlot
              key={slotKey}
              slotKey={slotKey}
              level={level}
              power={power}
              isPrimarySlot={level === 1 && slotIndex === 0}
              isSecondarySlot={level === 1 && slotIndex === 1}
              dragState={dragState}
              onPowerDragStart={onDragStart}
              onPowerDragEnd={onDragEnd}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ChronologicalPowerView() {
  const { slotAssignments, inherents } = useChronologicalPowers();
  const [dragState, setDragState] = useState<DragState | null>(null);

  const handleDragStart = useCallback((power: CategorizedPower) => {
    const validTargets = computeValidTargets(power, slotAssignments);
    setDragState({ draggedPower: power, validTargets });
  }, [slotAssignments]);

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex-1 overflow-auto">
        {/* Main 3-column grid - stacks on mobile/tablet, 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-700 min-h-0">
          {ALL_COLUMNS.map((column) => (
            <div key={column.index} className="bg-slate-900">
              <PowerColumn
                columnIndex={column.index}
                title={column.title}
                levels={column.levels}
                slotAssignments={slotAssignments}
                dragState={dragState}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>

        {/* Inherent powers section - inside scroll area to flow naturally after grid */}
        <ChronologicalInherentsSection inherents={inherents} />
      </div>
    </div>
  );
}

export default ChronologicalPowerView;
