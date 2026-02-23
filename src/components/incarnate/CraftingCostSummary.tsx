/**
 * CraftingCostSummary - Two-column shopping list showing NODE ONLY vs FULL PATH
 * costs (currency + salvage) for the selected incarnate power.
 */

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

/** Sort salvage entries by rarity (common → very-rare), then alphabetically */
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

export function CraftingCostSummary({
  nodeOnlySalvage,
  fullPathSalvage,
}: CraftingCostSummaryProps) {
  // Salvage purchase costs only (no crafting fees)
  const nodeCost = salvageCurrencyCost(nodeOnlySalvage);
  const fullCost = salvageCurrencyCost(fullPathSalvage);

  const nodeSorted = sortedSalvageEntries(nodeOnlySalvage);
  const fullSorted = sortedSalvageEntries(fullPathSalvage);

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
            <div className="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700/50">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Full Path</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-3 py-2 space-y-0.5 border-r border-gray-700/50">
              {nodeSorted.map(([id, qty]) => (
                <SalvageItem key={id} salvageId={id} quantity={qty} />
              ))}
            </div>
            <div className="px-3 py-2 space-y-0.5">
              {fullSorted.map(([id, qty]) => (
                <SalvageItem key={id} salvageId={id} quantity={qty} />
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

function SalvageItem({ salvageId, quantity }: { salvageId: SalvageId; quantity: number }) {
  const displayName = getSalvageDisplayName(salvageId);
  const color = getSalvageRarityColor(salvageId);

  return (
    <div className="text-xs" style={{ color }}>
      {quantity > 1 ? `${quantity}x ` : ''}{displayName}
    </div>
  );
}
