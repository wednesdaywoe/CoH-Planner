/**
 * SlottedSetBonuses - Set bonuses for the IO sets slotted in a single power.
 *
 * Companion to SlottedEnhancementList in the touch-only power expand view. The
 * enhancement picker already shows set bonuses while slotting (desktop hover
 * tooltip, mobile inline expander), but once a power is slotted there was no
 * way to review its active set bonuses from the main planner without reopening
 * the picker. This groups the power's io-set pieces by set, counts how many of
 * each are slotted, and reuses the shared SetBonusList to render each set's
 * bonus tiers with the same active/inactive, Rule-of-5, and tracked-stat
 * treatment as the picker.
 */

import { useMemo } from 'react';
import type { Enhancement, IOSetEnhancement } from '@/types';
import { getIOSet, getRarityColor } from '@/data';
import { SetBonusList } from '@/components/enhancements/SetBonusList';

interface SlottedSetBonusesProps {
  slots: (Enhancement | null)[];
}

export function SlottedSetBonuses({ slots }: SlottedSetBonusesProps) {
  // Group the power's io-set pieces by set, preserving first-seen order, and
  // resolve each to its full set definition for the bonus tiers.
  const sets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const slot of slots) {
      if (slot && slot.type === 'io-set') {
        const setId = (slot as IOSetEnhancement).setId;
        counts.set(setId, (counts.get(setId) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([setId, count]) => ({ set: getIOSet(setId), count }))
      .filter((entry): entry is { set: NonNullable<typeof entry.set>; count: number } =>
        !!entry.set && entry.set.bonuses.length > 0);
  }, [slots]);

  if (sets.length === 0) return null;

  return (
    <div className="mt-1 rounded-sm bg-slate-900/60 border border-slate-700/70 px-1.5 py-1 space-y-1.5">
      {sets.map(({ set, count }) => (
        <div key={set.id || set.name}>
          <div className={`text-[11px] font-medium ${getRarityColor(set.category)}`}>
            {set.name}
          </div>
          <SetBonusList set={set} piecesInPower={count} />
        </div>
      ))}
    </div>
  );
}
