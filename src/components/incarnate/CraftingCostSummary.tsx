/**
 * CraftingCostSummary - Two-column shopping list showing NODE ONLY vs FULL PATH
 * salvage lists for the selected incarnate power.
 * Each component is clickable: left-click decrements count by 1.
 * At 0 the item shows strikethrough+fade; another click resets to the initial value.
 */

import { useState, useCallback, useEffect } from 'react';
import type { SalvageId } from '@/types';
import {
  getSalvageDisplayName,
  getSalvageRarityColor,
  getSalvageCost,
} from '@/data';

const RARITY_ORDER: Record<string, number> = {
  'common': 0,
  'uncommon': 1,
  'rare': 2,
  'very-rare': 3,
};

interface CraftingCostSummaryProps {
  nodeOnlySalvage: Map<SalvageId, number>;
  fullPathSalvage: Map<SalvageId, number>;
}

/** Sort salvage entries by rarity (common -> very-rare), then alphabetically */
function sortedSalvageEntries(salvage: Map<SalvageId, number>): [SalvageId, number][] {
  return [...salvage.entries()].sort(([a], [b]) => {
    const ra = RARITY_ORDER[getSalvageCost(a).empyrean > 0 ? (getSalvageCost(a).empyrean >= 30 ? 'very-rare' : 'rare') : (getSalvageCost(a).threads >= 60 ? 'uncommon' : 'common')] ?? 0;
    const rb = RARITY_ORDER[getSalvageCost(b).empyrean > 0 ? (getSalvageCost(b).empyrean >= 30 ? 'very-rare' : 'rare') : (getSalvageCost(b).threads >= 60 ? 'uncommon' : 'common')] ?? 0;
    if (ra !== rb) return ra - rb;
    return getSalvageDisplayName(a).localeCompare(getSalvageDisplayName(b));
  });
}

/** Calculate total currency cost of purchasing salvage items */
function salvageCurrencyCost(salvage: Map<SalvageId, number>): { threads: number; empyrean: number } {
  let threads = 0, empyrean = 0;
  for (const [id, qty] of salvage) {
    const cost = getSalvageCost(id);
    threads += cost.threads * qty;
    empyrean += cost.empyrean * qty;
  }
  return { threads, empyrean };
}

/** Build a key->initial-count map for tracking, prefixed by column */
function buildCountMap(sorted: [SalvageId, number][], prefix: string): Record<string, number> {
  const map: Record<string, number> = {};
  for (const [id, qty] of sorted) {
    map[`${prefix}:${id}`] = qty;
  }
  return map;
}

export function CraftingCostSummary({
  nodeOnlySalvage,
  fullPathSalvage,
}: CraftingCostSummaryProps) {
  const nodeCost = salvageCurrencyCost(nodeOnlySalvage);
  const fullCost = salvageCurrencyCost(fullPathSalvage);

  const nodeSorted = sortedSalvageEntries(nodeOnlySalvage);
  const fullSorted = sortedSalvageEntries(fullPathSalvage);

  // Initial quantities for each column, keyed as "node:<id>" / "full:<id>"
  const initials: Record<string, number> = {
    ...buildCountMap(nodeSorted, 'node'),
    ...buildCountMap(fullSorted, 'full'),
  };

  // Track remaining counts per item (session-only state)
  const [remaining, setRemaining] = useState<Record<string, number>>(initials);

  // Reset remaining counts when the salvage data changes (different power selected)
  useEffect(() => {
    setRemaining({
      ...buildCountMap(nodeSorted, 'node'),
      ...buildCountMap(fullSorted, 'full'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeOnlySalvage, fullPathSalvage]);

  const handleClick = useCallback((key: string) => {
    setRemaining((prev) => {
      const current = prev[key] ?? 0;
      const initial = initials[key] ?? 0;
      // At 0 -> reset to initial, otherwise decrement by 1
      return { ...prev, [key]: current <= 0 ? initial : current - 1 };
    });
  }, [initials]);

  return (
    <div className="space-y-2">
      {/* Currency section */}
      <div className="border border-gray-700/50 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="px-3 py-1.5 bg-gray-800/50 border-b border-r border-gray-700/50">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Node Only</span>
          </div>
          <div className="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700/50">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Full Path</span>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="px-3 py-2 space-y-1 border-r border-gray-700/50">
            <CurrencyLine label="Threads" value={nodeCost.threads} />
            <MeritsLine base={nodeCost.empyrean} totalThreads={nodeCost.threads} />
          </div>
          <div className="px-3 py-2 space-y-1">
            <CurrencyLine label="Threads" value={fullCost.threads} />
            <MeritsLine base={fullCost.empyrean} totalThreads={fullCost.threads} />
          </div>
        </div>
      </div>

      {/* Salvage section */}
      {(nodeSorted.length > 0 || fullSorted.length > 0) && (
        <div className="border border-gray-700/50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="px-3 py-1.5 bg-gray-800/50 border-b border-r border-gray-700/50">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Node Only</span>
            </div>
            <div className="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Full Path</span>
              <span className="text-[9px] text-gray-500 italic">Click items to track</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-3 py-2 space-y-0.5 border-r border-gray-700/50">
              {nodeSorted.map(([id, qty]) => (
                <ClickableSalvageItem
                  key={id}
                  salvageId={id}
                  initialQty={qty}
                  remaining={remaining[`node:${id}`] ?? qty}
                  onClick={() => handleClick(`node:${id}`)}
                />
              ))}
            </div>
            <div className="px-3 py-2 space-y-0.5">
              {fullSorted.map(([id, qty]) => (
                <ClickableSalvageItem
                  key={id}
                  salvageId={id}
                  initialQty={qty}
                  remaining={remaining[`full:${id}`] ?? qty}
                  onClick={() => handleClick(`full:${id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CurrencyLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white font-bold">{value.toLocaleString()}</span>
      <span className="text-white font-bold">{label}</span>
    </div>
  );
}

function MeritsLine({ base, totalThreads }: { base: number; totalThreads: number }) {
  const allFromMerits = base + Math.ceil(totalThreads / 20);
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-purple-400 font-bold">
        {base}
        {totalThreads > 0 && <span className="text-purple-400/60"> ({allFromMerits})</span>}
      </span>
      <span className="text-purple-400 font-bold">Merits</span>
    </div>
  );
}

function ClickableSalvageItem({
  salvageId,
  initialQty,
  remaining,
  onClick,
}: {
  salvageId: SalvageId;
  initialQty: number;
  remaining: number;
  onClick: () => void;
}) {
  const displayName = getSalvageDisplayName(salvageId);
  const color = getSalvageRarityColor(salvageId);
  const isDone = remaining <= 0;

  return (
    <div
      className={`text-xs cursor-pointer select-none rounded px-1 py-0.5 transition-all hover:bg-gray-800/50
        ${isDone ? 'line-through opacity-40' : ''}`}
      style={{ color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {initialQty > 1 ? `${remaining} x ` : (isDone ? '0 x ' : '')}{displayName}
    </div>
  );
}
