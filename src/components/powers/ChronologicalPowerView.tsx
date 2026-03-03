/**
 * ChronologicalPowerView - Mids Reborn-style power display by level taken
 *
 * Displays powers in a 3-column grid organized by the level they were taken,
 * rather than by powerset category.
 */

import { useMemo } from 'react';
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

// Slot key type for the pre-computed assignments
type SlotKey = string; // Format: "columnIndex-slotIndex" e.g., "0-0", "0-1", "1-0"

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

    // Build the flat list of all 24 slot keys in order
    const slotAssignments = new Map<SlotKey, CategorizedPower>();
    const allSlots: { columnIndex: number; slotIndex: number }[] = [];
    ALL_COLUMNS.forEach((column) => {
      column.levels.forEach((_level, slotIndex) => {
        allSlots.push({ columnIndex: column.index, slotIndex });
      });
    });

    // Assign sorted powers sequentially to slots
    allPowers.forEach((power, idx) => {
      if (idx < allSlots.length) {
        const slot = allSlots[idx];
        slotAssignments.set(`${slot.columnIndex}-${slot.slotIndex}`, power);
      }
    });

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
}

function PowerColumn({ columnIndex, title, levels, slotAssignments }: ColumnProps) {
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
              level={level}
              power={power}
              isPrimarySlot={level === 1 && slotIndex === 0}
              isSecondarySlot={level === 1 && slotIndex === 1}
            />
          );
        })}
      </div>
    </div>
  );
}

export function ChronologicalPowerView() {
  const { slotAssignments, inherents } = useChronologicalPowers();

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
