/**
 * EnhancementCard component - displays an enhancement with its details
 */

import { useMemo } from 'react';
import type { IOSetPiece, IOSetRarity } from '@/types';
import { Badge, Tooltip } from '@/components/ui';
import { IOSetIcon } from './EnhancementIcon';
import { useLongPress } from '@/hooks';
import { useUIStore } from '@/stores';
import {
  normalizeAspectName,
  getAspectSchedule,
  getIOValueAtLevel,
  BOOST_MULTIPLIER_PER_LEVEL,
} from '@/utils/calculations';
import { getEnhancementOutline } from '@/utils/enhancement-outline';
import { findProcData, parseProcEffect } from '@/data/proc-data';

interface EnhancementCardProps {
  piece: IOSetPiece;
  setName: string;
  setIcon?: string;
  category?: IOSetRarity;
  level: number;
  isAttuned?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  enhancementId?: string;  // Added for info panel display
  boost?: number;
}

const RARITY_LABEL: Record<IOSetRarity, string> = {
  uncommon: 'Uncommon',
  rare: 'Rare',
  purple: 'Very Rare (Purple)',
  ato: 'Archetype Origin (ATO)',
  pvp: 'PvP',
  event: 'Event',
};

export function EnhancementCard({
  piece,
  setName,
  setIcon,
  category,
  level,
  isAttuned = false,
  isSelected = false,
  onClick,
  showDetails = false,
  enhancementId,
  boost = 0,
}: EnhancementCardProps) {
  const showEnhancementInfo = useUIStore((s) => s.showEnhancementInfo);
  const lockInfoPanel = useUIStore((s) => s.lockInfoPanel);

  // Long-press handler for mobile - shows enhancement info
  const handleLongPress = () => {
    if (enhancementId) {
      lockInfoPanel({
        type: 'enhancement',
        enhancementId,
      });
    }
  };

  const longPressHandlers = useLongPress({
    duration: 500,
    onLongPress: handleLongPress,
    onTap: onClick,
  });

  const outline = useMemo(() =>
    getEnhancementOutline(
      { name: piece.name, proc: piece.proc, unique: piece.unique },
      setName,
    ),
    [piece.name, piece.proc, piece.unique, setName],
  );

  // Hover handler for desktop
  const handleMouseEnter = () => {
    if (enhancementId) {
      showEnhancementInfo(enhancementId);
    }
  };

  return (
    <Tooltip
      content={<EnhancementTooltip piece={piece} setName={setName} level={level} isAttuned={isAttuned} boost={boost} category={category} />}
      position="right"
    >
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        data-info-hover="enhancement"
        {...longPressHandlers}
        className={`
          w-full flex items-center gap-3 p-2 rounded
          transition-colors text-left select-none
          ${
            isSelected
              ? 'bg-blue-900/30 border-2 border-blue-500'
              : 'bg-gray-800 border border-gray-700 hover:border-blue-500'
          }
        `}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'manipulation',
        }}
      >
        <div className="relative flex-shrink-0">
          <IOSetIcon
            icon={setIcon || 'Unknown.png'}
            attuned={isAttuned}
            category={category}
            size={40}
            alt={piece.name}
          />
          {outline.show && (
            <div
              className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full border border-gray-900 pointer-events-none"
              style={{
                background: outline.secondaryColor
                  ? `linear-gradient(135deg, ${outline.color} 50%, ${outline.secondaryColor} 50%)`
                  : outline.color,
              }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-200 truncate">{piece.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {isAttuned ? 'Attuned' : `Level ${level}`}
            </span>
            {piece.proc && <Badge variant="purple" size="sm">Proc</Badge>}
            {piece.unique && <Badge variant="warning" size="sm">Unique</Badge>}
          </div>
        </div>
        {showDetails && (
          <div className="text-xs text-gray-400">
            {piece.aspects.join(', ')}
          </div>
        )}
      </button>
    </Tooltip>
  );
}

interface EnhancementTooltipProps {
  piece: IOSetPiece;
  setName: string;
  level: number;
  isAttuned: boolean;
  boost?: number;
  category?: IOSetRarity;
}

/**
 * Calculate the enhancement value for each aspect
 * Multi-aspect modifier per Homecoming Wiki:
 * - 1 aspect: 100% of base value
 * - 2 aspects: 62.5% (5/8) of base value per aspect
 * - 3 aspects: 50% of base value per aspect
 * - 4 aspects: 43.75% of base value per aspect
 */
function calculateAspectValue(aspect: string, level: number, totalAspects: number): number | null {
  const normalized = normalizeAspectName(aspect);
  if (!normalized) return null;

  const schedule = getAspectSchedule(normalized);
  const baseValue = getIOValueAtLevel(level, schedule);

  // Apply multi-aspect modifier per Homecoming Wiki
  let modifier = 1.0;
  switch (totalAspects) {
    case 1: modifier = 1.0; break;
    case 2: modifier = 0.625; break;  // 5/8
    case 3: modifier = 0.5; break;
    case 4:
    default: modifier = 0.4375; break;
  }

  return baseValue * modifier;
}

function formatEnhValue(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function EnhancementTooltip({ piece, setName, level, isAttuned, boost = 0, category }: EnhancementTooltipProps) {
  // Attuned enhancements scale to character level; non-attuned use their fixed level
  const effectiveLevel = level;
  // Use explicit totalAspects when the piece has internal attributes beyond
  // the listed aspects (e.g. +Critical Hit% counts as 3 extra attributes)
  const aspectCount = piece.totalAspects ?? (piece.proc ? piece.aspects.length + 1 : piece.aspects.length);
  const boostMultiplier = 1 + boost * BOOST_MULTIPLIER_PER_LEVEL;
  const rarityLabel = category ? RARITY_LABEL[category] : null;
  const procEffect = piece.proc ? parseProcEffect((findProcData(piece.name, setName)?.mechanics) || '') : null;

  return (
    <div className="min-w-[220px]">
      <div className="font-medium text-white">{piece.name}</div>
      <div className="text-sm text-yellow-400">{setName}</div>
      <div className="text-xs text-gray-400 mb-2 flex items-center gap-2 flex-wrap">
        <span>{isAttuned ? 'Attuned (scales to level)' : `Level ${level}`}</span>
        {rarityLabel && <span className="text-blue-300">• {rarityLabel}</span>}
        {boost > 0 && <span className="text-green-400">+{boost} Boosted</span>}
      </div>

      {/* Aspects with calculated values */}
      <div className="space-y-1">
        {piece.aspects.map((aspect, i) => {
          const value = calculateAspectValue(aspect, effectiveLevel, aspectCount);
          const boostedValue = value !== null && boost > 0 ? value * boostMultiplier : null;
          return (
            <div key={i} className="text-sm flex justify-between items-baseline gap-2">
              <span className={getAspectColor(aspect)}>{aspect}</span>
              {value !== null && (
                <span className="text-green-400 font-mono text-xs">
                  +{formatEnhValue(boostedValue ?? value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Multi-aspect note */}
      {aspectCount > 1 && (
        <div className="text-xs text-gray-400 mt-1 italic">
          {aspectCount === 2 ? '62.5%' : aspectCount === 3 ? '50%' : '43.75%'} per aspect ({aspectCount} aspects)
        </div>
      )}

      {/* Special flags */}
      {(piece.proc || piece.unique) && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex gap-2">
            {piece.proc && (
              <Badge variant="purple" size="sm">Proc</Badge>
            )}
            {piece.unique && (
              <Badge variant="warning" size="sm">Unique</Badge>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1 leading-snug">
            {piece.proc && <div>Proc: chance to trigger an extra effect on activation{procEffect ? ` (${procEffect.category})` : ''}.</div>}
            {piece.unique && <div>Unique: only one of this piece can be slotted across your entire build.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function getAspectColor(stat: string): string {
  const lowerStat = stat.toLowerCase();
  if (lowerStat.includes('damage')) return 'text-red-400';
  if (lowerStat.includes('accuracy')) return 'text-yellow-400';
  if (lowerStat.includes('recharge')) return 'text-blue-400';
  if (lowerStat.includes('endurance')) return 'text-cyan-400';
  if (lowerStat.includes('defense')) return 'text-green-400';
  if (lowerStat.includes('heal')) return 'text-green-300';
  if (lowerStat.includes('range')) return 'text-purple-400';
  return 'text-gray-300';
}

