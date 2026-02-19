/**
 * CraftingCostSummary - Shows aggregated crafting costs for a selected tree
 */

import type { IncarnateSlotId, CraftingChecklistState } from '@/types';
import { calculateCumulativeCost } from '@/data';

interface CraftingCostSummaryProps {
  slotId: IncarnateSlotId;
  targetTier: number;
  checklist: CraftingChecklistState;
}

export function CraftingCostSummary({
  slotId,
  targetTier,
  checklist,
}: CraftingCostSummaryProps) {
  const costs = calculateCumulativeCost(slotId, targetTier);

  // Count checked items for this slot
  const slotKeys = Object.keys(checklist).filter((k) => k.startsWith(`${slotId}:`));
  const checkedCount = slotKeys.filter((k) => checklist[k]).length;
  const totalCount = slotKeys.length;

  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden">
      <div className="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700/50">
        <span className="text-xs font-semibold text-gray-300">
          Total Cost (T1–T{targetTier})
        </span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <SummaryRow label="Threads" value={costs.threads} />
        {costs.empyrean > 0 && <SummaryRow label="Empyrean" value={costs.empyrean} />}
        {costs.shards > 0 && <SummaryRow label="Shards" value={costs.shards} />}
        {costs.noticeOfWell > 0 && <SummaryRow label="Notice of the Well" value={costs.noticeOfWell} />}

        {/* Progress */}
        {totalCount > 0 && (
          <div className="pt-2 mt-2 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{checkedCount}/{totalCount} items</span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200 font-medium">{value.toLocaleString()}</span>
    </div>
  );
}
