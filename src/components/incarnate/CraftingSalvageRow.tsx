/**
 * CraftingSalvageRow - Individual salvage item row with checkbox
 */

import type { SalvageRequirement, CraftingChecklistKey } from '@/types';
import { getSalvageDisplayName, getSalvageRarityColor } from '@/data';

interface CraftingSalvageRowProps {
  salvage: SalvageRequirement;
  checkKey: CraftingChecklistKey;
  isChecked: boolean;
  onToggle: (key: CraftingChecklistKey) => void;
  disabled?: boolean;
}

export function CraftingSalvageRow({
  salvage,
  checkKey,
  isChecked,
  onToggle,
  disabled = false,
}: CraftingSalvageRowProps) {
  const displayName = getSalvageDisplayName(salvage.salvageId);
  const color = getSalvageRarityColor(salvage.salvageId);

  return (
    <label
      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-800/50'}
        ${isChecked ? 'opacity-60' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => !disabled && onToggle(checkKey)}
        disabled={disabled}
        className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <span
        className={`text-xs ${isChecked ? 'line-through' : ''}`}
        style={{ color }}
      >
        {salvage.quantity > 1 ? `${salvage.quantity}x ` : ''}{displayName}
      </span>
    </label>
  );
}
