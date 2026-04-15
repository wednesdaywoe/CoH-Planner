/**
 * PowerSlot component - displays a single enhancement slot
 */

import type { Enhancement } from '@/types';
import { Tooltip } from '@/components/ui';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';
import { getIOSet } from '@/data';
import { useBonusTracking } from '@/hooks';
import { normalizeStatName, getTotalBonusCount, isBonusCapped } from '@/utils/calculations';

interface PowerSlotProps {
  enhancement: Enhancement | null;
  slotIndex: number;
  /** All slots in the parent power (used to count same-set pieces for bonus display) */
  slots?: (Enhancement | null)[];
  onClick: () => void;
  onRightClick?: () => void;
  isAddButton?: boolean;
}

export function PowerSlot({
  enhancement,
  slotIndex,
  slots,
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
        data-onboarding="add-slot"
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
        data-onboarding="slot-enhancement"
      >
        <span className="text-xs text-gray-500">{slotIndex + 1}</span>
      </button>
    );
  }

  return (
    <Tooltip content={<EnhancementTooltip enhancement={enhancement} slots={slots} />}>
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
  slots?: (Enhancement | null)[];
}

/** Format a number to at most 2 decimal places, removing trailing zeros */
function formatBonusValue(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toString();
}

function EnhancementTooltip({ enhancement, slots }: EnhancementTooltipProps) {
  const ioSet = enhancement.type === 'io-set' ? getIOSet(enhancement.setId) : undefined;
  const bonusTracking = useBonusTracking();

  // Count how many pieces of this set are slotted in the same power
  let slottedCount = 0;
  if (ioSet && enhancement.type === 'io-set' && slots) {
    slottedCount = slots.filter(
      (s) => s && s.type === 'io-set' && (s as Enhancement & { type: 'io-set' }).setId === enhancement.setId
    ).length;
  }

  return (
    <div className="min-w-[150px]">
      <div className="font-medium text-white">{enhancement.name}</div>
      {enhancement.type === 'io-set' && (
        <div className="text-sm text-yellow-400">
          {enhancement.setName}
          {ioSet && <span className="text-yellow-600 ml-1.5 text-xs">({enhancement.pieceNum}/{ioSet.pieces.length})</span>}
        </div>
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

      {/* Set bonuses */}
      {ioSet && slottedCount >= 2 && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-400 mb-1">
            Set Bonuses ({slottedCount}/{ioSet.pieces.length} slotted)
          </div>
          <div className="space-y-0.5">
            {ioSet.bonuses.map((bonus, index) => {
              const isActive = bonus.pieces <= slottedCount;
              const pveEffects = bonus.effects.filter((e) => !e.pvp);
              if (pveEffects.length === 0) return null;
              return (
                <div
                  key={index}
                  className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}
                >
                  <span className="font-medium">{bonus.pieces}pc:</span>{' '}
                  {pveEffects.map((e, i) => {
                    const normalized = isActive ? normalizeStatName(e.stat) : null;
                    const totalCount = normalized ? getTotalBonusCount(bonusTracking, normalized, e.value) : 0;
                    const capped = normalized ? isBonusCapped(bonusTracking, normalized, e.value) : false;
                    return (
                      <span key={i} className={capped ? 'text-orange-400 font-semibold' : ''}>
                        {i > 0 && ', '}
                        {e.desc || `${e.stat} +${formatBonusValue(e.value)}%`}
                        {isActive && totalCount > 0 && (
                          <span className={`ml-0.5 text-[9px] ${capped ? 'text-orange-400' : 'text-slate-500'}`}>
                            ({totalCount}/5)
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
