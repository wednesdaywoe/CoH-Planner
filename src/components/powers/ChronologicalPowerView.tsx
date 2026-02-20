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
 * Hook to collect, organize, and pre-assign all selected powers to slots
 */
function useChronologicalPowers() {
  const build = useBuildStore((s) => s.build);

  return useMemo(() => {
    const allPowers: CategorizedPower[] = [];

    // Collect primary powers
    build.primary.powers.forEach((p) => {
      allPowers.push({
        ...p,
        category: 'primary',
      });
    });

    // Collect secondary powers
    build.secondary.powers.forEach((p) => {
      allPowers.push({
        ...p,
        category: 'secondary',
      });
    });

    // Collect pool powers
    build.pools.forEach((pool) => {
      pool.powers.forEach((p) => {
        allPowers.push({
          ...p,
          category: 'pool',
          poolName: pool.name,
        });
      });
    });

    // Collect epic/patron powers
    if (build.epicPool) {
      build.epicPool.powers.forEach((p) => {
        allPowers.push({
          ...p,
          category: 'epic',
          poolName: build.epicPool?.name,
        });
      });
    }

    // Group powers by level
    const powersByLevel = new Map<number, CategorizedPower[]>();

    allPowers.forEach((power) => {
      const level = power.level;
      if (!powersByLevel.has(level)) {
        powersByLevel.set(level, []);
      }
      powersByLevel.get(level)!.push(power);
    });

    // Sort powers at each level by category (primary first, then secondary)
    powersByLevel.forEach((powers) => {
      powers.sort((a, b) => {
        const order: PowerCategory[] = ['primary', 'secondary', 'pool', 'epic'];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });
    });

    // Pre-compute slot assignments (no mutation during render)
    const slotAssignments = new Map<SlotKey, CategorizedPower>();
    const usedPowers = new Set<string>();

    // Helper to assign power to slot
    const assignPowerToSlot = (
      columnIndex: number,
      slotIndex: number,
      level: number,
      categoryFilter?: PowerCategory
    ) => {
      const powers = powersByLevel.get(level);
      if (!powers || powers.length === 0) return;

      let power: CategorizedPower | undefined;
      if (categoryFilter) {
        power = powers.find((p) => p.category === categoryFilter && !usedPowers.has(p.name));
      } else {
        power = powers.find((p) => !usedPowers.has(p.name));
      }

      if (power) {
        usedPowers.add(power.name);
        slotAssignments.set(`${columnIndex}-${slotIndex}`, power);
      }
    };

    // Process each column
    ALL_COLUMNS.forEach((column) => {
      column.levels.forEach((level, slotIndex) => {
        if (level === 1) {
          // Level 1: first slot is primary, second slot is secondary
          if (slotIndex === 0) {
            assignPowerToSlot(column.index, slotIndex, level, 'primary');
          } else if (slotIndex === 1) {
            assignPowerToSlot(column.index, slotIndex, level, 'secondary');
          }
        } else {
          assignPowerToSlot(column.index, slotIndex, level);
        }
      });
    });

    return {
      slotAssignments,
      powersByLevel,
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
      {/* Main 3-column grid - stacks on mobile/tablet, 3 columns on desktop */}
      <div className="flex-1 overflow-auto">
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

      </div>

      {/* Inherent powers section */}
      <ChronologicalInherentsSection inherents={inherents} />
    </div>
  );
}

export default ChronologicalPowerView;
