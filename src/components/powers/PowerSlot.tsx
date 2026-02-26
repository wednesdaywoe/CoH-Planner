/**
 * PowerSlot component - displays a single enhancement slot
 */

import type { Enhancement } from '@/types';
import { Tooltip } from '@/components/ui';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';

interface PowerSlotProps {
  enhancement: Enhancement | null;
  slotIndex: number;
  onClick: () => void;
  onRightClick?: () => void;
  isAddButton?: boolean;
}

export function PowerSlot({
  enhancement,
  slotIndex,
  onClick,
  onRightClick,
  isAddButton = false,
}: PowerSlotProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick?.();
  };

  if (isAddButton) {
    return (
      <button
        onClick={onClick}
        className="w-8 h-8 rounded border-2 border-dashed border-gray-600 hover:border-blue-500 flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors"
        title="Add enhancement slot"
      >
        +
      </button>
    );
  }

  if (!enhancement) {
    return (
      <button
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className="w-8 h-8 rounded bg-gray-700 border border-gray-600 hover:border-blue-500 flex items-center justify-center transition-colors"
        title={`Slot ${slotIndex + 1} - Click to add enhancement`}
      >
        <span className="text-xs text-gray-500">{slotIndex + 1}</span>
      </button>
    );
  }

  return (
    <Tooltip content={<EnhancementTooltip enhancement={enhancement} />}>
      <button
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={`
          w-8 h-8 rounded border overflow-hidden
          transition-colors
          ${getEnhancementBorderColor(enhancement)}
          hover:ring-2 hover:ring-blue-500
        `}
      >
        <SlottedEnhancementIcon enhancement={enhancement} size={32} />
      </button>
    </Tooltip>
  );
}

interface EnhancementTooltipProps {
  enhancement: Enhancement;
}

function EnhancementTooltip({ enhancement }: EnhancementTooltipProps) {
  return (
    <div className="min-w-[150px]">
      <div className="font-medium text-white">{enhancement.name}</div>
      {enhancement.type === 'io-set' && (
        <div className="text-sm text-yellow-400">{enhancement.setName}</div>
      )}
      <div className="text-xs text-gray-400 flex items-center gap-2">
        {enhancement.level && (
          <span>
            Level {enhancement.level}
            {enhancement.attuned && ' (Attuned)'}
          </span>
        )}
        {enhancement.attuned && !enhancement.level && (
          <span>Attuned</span>
        )}
        {enhancement.boost && enhancement.boost > 0 && (
          <span className="text-green-400">+{enhancement.boost} Boosted</span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Right-click to remove
      </div>
    </div>
  );
}

function getEnhancementBorderColor(enhancement: Enhancement): string {
  switch (enhancement.type) {
    case 'io-set':
      return 'border-yellow-500';
    case 'io-generic':
      return 'border-gray-400';
    case 'special':
      return 'border-purple-500';
    case 'origin':
      return 'border-green-500';
    default:
      return 'border-gray-600';
  }
}
