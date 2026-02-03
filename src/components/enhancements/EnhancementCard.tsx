/**
 * EnhancementCard component - displays an enhancement with its details
 */

import type { IOSetPiece } from '@/types';
import { Badge, Tooltip } from '@/components/ui';
import { IOSetIcon } from './EnhancementIcon';
import {
  normalizeAspectName,
  getAspectSchedule,
  getIOValueAtLevel,
} from '@/utils/calculations';

interface EnhancementCardProps {
  piece: IOSetPiece;
  setName: string;
  setIcon?: string;
  level: number;
  isAttuned?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

export function EnhancementCard({
  piece,
  setName,
  setIcon,
  level,
  isAttuned = false,
  isSelected = false,
  onClick,
  showDetails = false,
}: EnhancementCardProps) {
  return (
    <Tooltip
      content={<EnhancementTooltip piece={piece} setName={setName} level={level} isAttuned={isAttuned} />}
      position="right"
    >
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 p-2 rounded
          transition-colors text-left
          ${
            isSelected
              ? 'bg-blue-900/30 border-2 border-blue-500'
              : 'bg-gray-800 border border-gray-700 hover:border-blue-500'
          }
        `}
      >
        <IOSetIcon
          icon={setIcon || 'Unknown.png'}
          attuned={isAttuned}
          size={40}
          alt={piece.name}
        />
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

function EnhancementTooltip({ piece, setName, level, isAttuned }: EnhancementTooltipProps) {
  // For attuned, use level 50 for display purposes
  const effectiveLevel = isAttuned ? 50 : level;
  const aspectCount = piece.aspects.length;

  return (
    <div className="min-w-[220px]">
      <div className="font-medium text-white">{piece.name}</div>
      <div className="text-sm text-yellow-400">{setName}</div>
      <div className="text-xs text-gray-400 mb-2">
        {isAttuned ? 'Attuned (scales to level)' : `Level ${level}`}
      </div>

      {/* Aspects with calculated values */}
      <div className="space-y-1">
        {piece.aspects.map((aspect, i) => {
          const value = calculateAspectValue(aspect, effectiveLevel, aspectCount);
          return (
            <div key={i} className="text-sm flex justify-between items-baseline gap-2">
              <span className={getAspectColor(aspect)}>{aspect}</span>
              {value !== null && (
                <span className="text-green-400 font-mono text-xs">
                  +{formatEnhValue(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Multi-aspect note */}
      {aspectCount > 1 && (
        <div className="text-[10px] text-gray-500 mt-1 italic">
          {aspectCount === 2 ? '62.5%' : aspectCount === 3 ? '50%' : '43.75%'} per aspect ({aspectCount} aspects)
        </div>
      )}

      {/* Special flags */}
      {(piece.proc || piece.unique) && (
        <div className="mt-2 pt-2 border-t border-gray-700 flex gap-2">
          {piece.proc && (
            <Badge variant="purple" size="sm">Proc</Badge>
          )}
          {piece.unique && (
            <Badge variant="warning" size="sm">Unique</Badge>
          )}
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

