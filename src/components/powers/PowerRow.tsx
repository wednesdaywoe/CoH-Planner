/**
 * PowerRow - Unified power row component used across all planner views
 *
 * Renders a power's icon, name, level, enhancement slots, and toggle switch.
 * Supports multiple size variants and layout modes.
 */

import type { Enhancement } from '@/types';
import { resolvePath } from '@/utils/paths';
import { Tooltip } from '@/components/ui';
import { TouchableSlot } from './TouchableSlot';
import { DraggableSlotGhost } from './DraggableSlotGhost';
import type { SlotSize } from './TouchableSlot';

type PowerRowSize = 'xs' | 'sm' | 'md' | 'lg';

const SLOT_SIZE_MAP: Record<PowerRowSize, SlotSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

const GHOST_SIZE_MAP: Record<PowerRowSize, 'xs' | 'sm' | 'md'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

const ICON_CLASS_MAP: Record<PowerRowSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

const TOGGLE_CONFIG = {
  md: { outer: 'w-6 h-3', knob: 'w-2 h-2', translate: 'translate-x-3', offset: 'top-[2px] left-[2px]' },
  sm: { outer: 'w-5 h-2.5', knob: 'w-1.5 h-1.5', translate: 'translate-x-2.5', offset: 'top-[2px] left-[2px]' },
};

interface PowerRowProps {
  name: string;
  iconSrc: string;
  size?: PowerRowSize;
  stackedLayout?: boolean;
  level?: number;
  showRemove?: boolean;
  showAutoLabel?: boolean;
  categoryBorder?: string;
  muted?: boolean;
  toggleSize?: 'sm' | 'md';
  isActive?: boolean;
  onToggle?: () => void;
  slots: (Enhancement | null)[];
  maxSlots: number;
  isLocked?: boolean;
  onRemove?: () => void;
  onAddSlots?: (count: number) => void;
  onRemoveSlot?: (slotIndex: number) => void;
  onRemoveAllSlots?: () => void;
  onClearEnhancement?: (slotIndex: number) => void;
  onClearAllEnhancements?: () => void;
  onOpenPicker?: (slotIndex: number) => void;
  onHover?: () => void;
  onLeave?: () => void;
  onEnhancementHover?: (slotIndex: number) => void;
  onRightClick?: (e: React.MouseEvent) => void;
}

export function PowerRow({
  name,
  iconSrc,
  size = 'md',
  stackedLayout = false,
  level,
  showRemove = true,
  showAutoLabel = false,
  categoryBorder,
  muted = false,
  toggleSize,
  isActive = false,
  onToggle,
  slots,
  maxSlots,
  isLocked = false,
  onRemove,
  onAddSlots,
  onRemoveSlot,
  onRemoveAllSlots,
  onClearEnhancement,
  onClearAllEnhancements,
  onOpenPicker,
  onHover,
  onLeave,
  onEnhancementHover,
  onRightClick,
}: PowerRowProps) {
  const slotSize = SLOT_SIZE_MAP[size];
  const ghostSize = GHOST_SIZE_MAP[size];
  const iconClass = ICON_CLASS_MAP[size];

  const handleSlotClick = (index: number) => {
    onOpenPicker?.(index);
  };

  const handleSlotMouseEnter = (index: number, hasEnhancement: boolean) => {
    if (hasEnhancement) {
      onEnhancementHover?.(index);
    } else {
      onHover?.();
    }
  };

  // Outer container classes
  const bgClass = muted ? 'bg-slate-800/50' : 'bg-slate-800';
  const borderClass = isLocked
    ? `${categoryBorder ? 'border-l-4 border-l-amber-500' : ''} border-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500/10 to-slate-800`
    : categoryBorder
      ? `${categoryBorder} border-slate-700 hover:border-slate-600`
      : 'border-slate-700 hover:border-slate-600';

  // Indent spacer for inline layout row 2
  const getIndentWidth = () => {
    if (level !== undefined) return 'w-7';
    return 'w-5';
  };

  const renderNameRow = () => (
    <div className="flex items-center min-w-0">
      <span
        className="text-xs text-slate-200 truncate flex-1 min-w-0 cursor-default"
        onMouseEnter={onHover}
        onContextMenu={onRightClick}
        title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
      >
        {name}
      </span>
      {showAutoLabel && (
        <span className="text-[9px] text-slate-500 ml-1 flex-shrink-0">(Auto)</span>
      )}
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 leading-none"
          title="Remove power"
        >
          ✕
        </button>
      )}
    </div>
  );

  const renderSlots = () => (
    <div className="flex gap-0.5 items-center flex-1">
      {slots.map((slot, index) => (
        <TouchableSlot
          key={index}
          slot={slot}
          index={index}
          canRemoveSlot={index > 0}
          size={slotSize}
          onClick={() => handleSlotClick(index)}
          onMouseEnter={() => handleSlotMouseEnter(index, !!slot)}
          onClearEnhancement={() => onClearEnhancement?.(index)}
          onRemoveSlot={() => onRemoveSlot?.(index)}
          onClearAllEnhancements={() => onClearAllEnhancements?.()}
          onRemoveAllSlots={() => onRemoveAllSlots?.()}
        />
      ))}
      {onAddSlots && (
        <DraggableSlotGhost
          powerName={name}
          currentSlots={slots.length}
          maxSlots={maxSlots}
          onAddSlots={onAddSlots}
          size={ghostSize}
        />
      )}
    </div>
  );

  const renderToggle = () => {
    if (!toggleSize || !onToggle) return null;
    const config = TOGGLE_CONFIG[toggleSize];
    return (
      <Tooltip
        content={
          isActive
            ? 'Power ON - stats included in calculations'
            : 'Power OFF - click to include in stats'
        }
      >
        <button
          onClick={onToggle}
          className={`
            flex-shrink-0 relative ${config.outer} rounded-full transition-colors duration-200
            ${isActive ? 'bg-green-600' : 'bg-slate-600'}
          `}
        >
          <span
            className={`
              absolute ${config.offset} ${config.knob} rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${isActive ? config.translate : 'translate-x-0'}
            `}
          />
        </button>
      </Tooltip>
    );
  };

  if (stackedLayout) {
    // Stacked layout: Level+Icon left column, Name+Slots right column
    return (
      <div
        className={`flex flex-col px-1.5 py-1 ${bgClass} border rounded-sm group transition-colors ${borderClass}`}
        onMouseLeave={onLeave}
      >
        <div className="flex min-w-0">
          {/* Left column: Level on top, icon underneath */}
          <div className={`flex flex-col items-center flex-shrink-0 mr-1 ${level !== undefined ? 'justify-between' : 'justify-center'}`}>
            {level !== undefined && (
              <span className="text-[10px] font-semibold text-slate-500 leading-tight">L{level}</span>
            )}
            <img
              src={iconSrc}
              alt=""
              className={`${iconClass} rounded-sm ${level !== undefined ? 'mt-0.5' : ''}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
              }}
            />
          </div>

          {/* Right column: Name (row 1) + Slots (row 2) */}
          <div className="flex flex-col flex-1 min-w-0">
            {renderNameRow()}
            <div className="flex items-center mt-0.5">
              {renderSlots()}
              {renderToggle()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline layout: Row 1 = Level Icon Name X, Row 2 = indent Slots Toggle
  return (
    <div
      className={`flex flex-col px-1.5 py-1 ${bgClass} border rounded-sm group transition-colors ${borderClass}`}
      onMouseLeave={onLeave}
    >
      {/* Row 1: Level · Icon · Name | Auto | X */}
      <div className="flex items-center min-w-0">
        {level !== undefined && (
          <span className="text-[10px] font-semibold text-slate-500 w-5 text-right flex-shrink-0 mr-1">L{level}</span>
        )}
        <img
          src={iconSrc}
          alt=""
          className={`${iconClass} rounded-sm flex-shrink-0 mr-1`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <span
          className="text-xs text-slate-200 truncate flex-1 min-w-0 cursor-default"
          onMouseEnter={onHover}
          onContextMenu={onRightClick}
          title={isLocked ? 'Right-click to unlock power info' : 'Right-click to lock power info'}
        >
          {name}
        </span>
        {showAutoLabel && (
          <span className="text-[9px] text-slate-500 ml-1 flex-shrink-0">(Auto)</span>
        )}
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="text-slate-600 hover:text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 leading-none"
            title="Remove power"
          >
            ✕
          </button>
        )}
      </div>

      {/* Row 2: Indent + Slots + Toggle */}
      <div className="flex items-center mt-0.5">
        <div className={`${getIndentWidth()} flex-shrink-0`} />
        {renderSlots()}
        {renderToggle()}
      </div>
    </div>
  );
}
