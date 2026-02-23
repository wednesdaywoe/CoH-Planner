/**
 * ShoppingListView - Aggregated salvage shopping list across all incarnate slots.
 * Left-click to mark one as acquired, right-click to undo.
 */

import { useMemo } from 'react';
import { useBuildStore } from '@/stores';
import { INCARNATE_SLOT_ORDER, inferBranchFromPowerName } from '@/types';
import type { SalvageId, IncarnateBranch } from '@/types';
import {
  getTreeComponents,
  getSalvageDisplayName,
  getSalvageRarityColor,
  getSalvageRarity,
  getSalvageCost,
} from '@/data';
import { TIER_NUMBER, aggregateSalvage } from './crafting-utils';

const RARITY_SORT: Record<string, number> = {
  'common': 0,
  'uncommon': 1,
  'rare': 2,
  'very-rare': 3,
};

export function ShoppingListView() {
  const incarnates = useBuildStore((s) => s.build.incarnates);
  const shoppingListAcquired = useBuildStore((s) => s.build.shoppingListAcquired);
  const acquireItem = useBuildStore((s) => s.acquireShoppingItem);
  const unacquireItem = useBuildStore((s) => s.unacquireShoppingItem);

  // Aggregate all salvage across all slots
  const totalSalvage = useMemo(() => {
    const totals = new Map<SalvageId, number>();

    for (const slotId of INCARNATE_SLOT_ORDER) {
      const power = incarnates[slotId];
      if (!power) continue;

      const targetTier = TIER_NUMBER[power.tier] ?? 4;
      const branch: IncarnateBranch = inferBranchFromPowerName(power.displayName);
      const treeComponents = getTreeComponents(slotId, power.treeName);
      if (!treeComponents || targetTier <= 0) continue;

      const slotSalvage = aggregateSalvage(treeComponents, branch, 1, targetTier);
      for (const [id, qty] of slotSalvage) {
        totals.set(id, (totals.get(id) || 0) + qty);
      }
    }

    return totals;
  }, [incarnates]);

  // Sort: rarity (common -> very-rare), then alphabetical
  const sortedEntries = useMemo(() => {
    return [...totalSalvage.entries()].sort(([a], [b]) => {
      const ra = RARITY_SORT[getSalvageRarity(a)] ?? 0;
      const rb = RARITY_SORT[getSalvageRarity(b)] ?? 0;
      if (ra !== rb) return ra - rb;
      return getSalvageDisplayName(a).localeCompare(getSalvageDisplayName(b));
    });
  }, [totalSalvage]);

  // Calculate remaining currency totals
  const currencyTotals = useMemo(() => {
    let threads = 0, empyrean = 0;
    for (const [id, qty] of totalSalvage) {
      const acquired = Math.min(shoppingListAcquired[id] || 0, qty);
      const remaining = qty - acquired;
      const cost = getSalvageCost(id);
      threads += cost.threads * remaining;
      empyrean += cost.empyrean * remaining;
    }
    return { threads, empyrean };
  }, [totalSalvage, shoppingListAcquired]);

  if (sortedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <p className="text-gray-400 text-sm">No incarnate powers selected.</p>
        <p className="text-gray-500 text-xs">Select powers in each slot to see a consolidated shopping list.</p>
      </div>
    );
  }

  const allFromMerits = currencyTotals.empyrean + Math.ceil(currencyTotals.threads / 20);

  return (
    <div className="p-4 space-y-3">
      {/* Instructions */}
      <div className="text-[10px] text-gray-500 text-center">
        Click to mark acquired &middot; Right-click to undo
      </div>

      {/* Currency summary */}
      <div className="border border-gray-700/50 rounded-lg px-3 py-2 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white font-bold">{currencyTotals.threads.toLocaleString()}</span>
          <span className="text-white font-bold">Threads</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-purple-400 font-bold">
            {currencyTotals.empyrean}
            {currencyTotals.threads > 0 && (
              <span className="text-purple-400/60"> ({allFromMerits})</span>
            )}
          </span>
          <span className="text-purple-400 font-bold">Merits</span>
        </div>
      </div>

      {/* Salvage list */}
      <div className="space-y-0.5">
        {sortedEntries.map(([salvageId, totalNeeded]) => {
          const acquired = Math.min(shoppingListAcquired[salvageId] || 0, totalNeeded);
          const remaining = totalNeeded - acquired;
          const isComplete = remaining <= 0;
          const displayName = getSalvageDisplayName(salvageId);
          const color = getSalvageRarityColor(salvageId);

          return (
            <div
              key={salvageId}
              onClick={() => { if (remaining > 0) acquireItem(salvageId); }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (acquired > 0) unacquireItem(salvageId);
              }}
              className={`
                px-3 py-1.5 rounded cursor-pointer select-none transition-colors
                ${isComplete ? 'opacity-40' : 'hover:bg-gray-800/50'}
              `}
            >
              <span
                className={`text-xs ${isComplete ? 'line-through' : ''}`}
                style={{ color: isComplete ? '#6b7280' : color }}
              >
                {isComplete ? '' : `${remaining}x `}{displayName}
              </span>
              {acquired > 0 && !isComplete && (
                <span className="text-[10px] text-gray-500 ml-2">
                  ({acquired}/{totalNeeded})
                </span>
              )}
              {isComplete && (
                <span className="text-[10px] text-gray-600 ml-1">&#x2713;</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
