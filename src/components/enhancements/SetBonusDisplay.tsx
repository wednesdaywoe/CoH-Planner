/**
 * SetBonusDisplay component - shows active set bonuses
 */

import { useActiveSetBonuses, useBonusTracking } from '@/hooks';
import { normalizeStatName, getTotalBonusCount, isBonusCapped } from '@/utils/calculations';
import { Tooltip, Badge } from '@/components/ui';
import type { SetBonus } from '@/types';
import type { BonusTracking } from '@/utils/calculations';

/** Format a number to at most 2 decimal places, removing trailing zeros */
function formatBonusValue(value: number): string {
  // Round to 2 decimal places to avoid floating point issues
  const rounded = Math.round(value * 100) / 100;
  // Convert to string, which automatically removes trailing zeros
  return rounded.toString();
}

export function SetBonusDisplay() {
  const activeBonuses = useActiveSetBonuses();
  const bonusTracking = useBonusTracking();

  if (activeBonuses.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4 text-sm">
        No active set bonuses
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeBonuses.map((item) => (
        <SetBonusItem
          key={item.setId}
          setName={item.setName}
          piecesSlotted={item.piecesSlotted}
          bonuses={item.bonuses}
          bonusTracking={bonusTracking}
        />
      ))}
    </div>
  );
}

interface SetBonusItemProps {
  setName: string;
  piecesSlotted: number;
  bonuses: SetBonus[];
  bonusTracking: BonusTracking;
}

function SetBonusItem({ setName, piecesSlotted, bonuses, bonusTracking }: SetBonusItemProps) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-yellow-400">{setName}</span>
        <Badge variant="primary" size="sm">{piecesSlotted} pcs</Badge>
      </div>
      <div className="space-y-1">
        {bonuses.map((bonus, index) => (
          <BonusRow key={index} bonus={bonus} isActive={bonus.pieces <= piecesSlotted} bonusTracking={bonusTracking} />
        ))}
      </div>
    </div>
  );
}

interface BonusRowProps {
  bonus: SetBonus;
  isActive: boolean;
  bonusTracking: BonusTracking;
}

function BonusRow({ bonus, isActive, bonusTracking }: BonusRowProps) {
  const pveEffects = bonus.effects.filter(e => !e.pvp);
  const pvpEffects = bonus.effects.filter(e => e.pvp);

  // Check if any PvE effect is capped
  const hasAnyCapped = isActive && pveEffects.some(e => {
    const normalized = normalizeStatName(e.stat);
    return normalized ? isBonusCapped(bonusTracking, normalized, e.value) : false;
  });

  return (
    <Tooltip
      content={
        <div>
          <div className="font-medium">Requires {bonus.pieces} pieces</div>
          {pveEffects.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {pveEffects.map((effect, i) => {
                const normalized = isActive ? normalizeStatName(effect.stat) : null;
                const totalCount = normalized ? getTotalBonusCount(bonusTracking, normalized, effect.value) : 0;
                const capped = normalized ? isBonusCapped(bonusTracking, normalized, effect.value) : false;
                return (
                  <div key={i} className={`text-sm ${capped ? 'text-orange-400' : ''}`}>
                    {effect.stat}: +{formatBonusValue(effect.value)}%
                    {isActive && totalCount > 0 && (
                      <span className={`ml-1 text-xs ${capped ? 'text-orange-400 font-semibold' : 'text-slate-500'}`}>
                        ({totalCount}/5)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {pvpEffects.length > 0 && (
            <>
              <div className="text-[10px] text-red-400/70 uppercase mt-1.5 mb-0.5">PvP Only</div>
              <div className="space-y-0.5">
                {pvpEffects.map((effect, i) => (
                  <div key={i} className="text-sm text-red-400/60">
                    {effect.stat}: +{formatBonusValue(effect.value)}%
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      }
    >
      <div
        className={`
          flex items-center justify-between text-xs py-0.5
          ${hasAnyCapped ? 'text-orange-400' : isActive ? 'text-green-400' : 'text-gray-500'}
        `}
      >
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${hasAnyCapped ? 'bg-orange-400' : isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
          {bonus.pieces}pc:
        </span>
        <span className="truncate ml-2">
          {pveEffects.map((e) => e.stat).join(', ')}
        </span>
      </div>
    </Tooltip>
  );
}

/**
 * Compact set bonus summary for tooltips
 */
interface SetBonusSummaryProps {
  setId: string;
  setName: string;
  totalPieces: number;
  slottedPieces: number;
  bonuses: SetBonus[];
  bonusTracking?: BonusTracking;
}

export function SetBonusSummary({
  setName,
  totalPieces,
  slottedPieces,
  bonuses,
  bonusTracking,
}: SetBonusSummaryProps) {
  return (
    <div className="min-w-[200px]">
      <div className="font-medium text-yellow-400">{setName}</div>
      <div className="text-xs text-gray-400 mb-2">
        {slottedPieces}/{totalPieces} pieces slotted
      </div>
      <div className="space-y-1">
        {bonuses.map((bonus, index) => {
          const isActive = bonus.pieces <= slottedPieces;
          const pveEffects = bonus.effects.filter(e => !e.pvp);
          const pvpEffects = bonus.effects.filter(e => e.pvp);
          return (
            <div key={index}>
              {pveEffects.length > 0 && (
                <div className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                  <span className="font-medium">{bonus.pieces}pc:</span>{' '}
                  {pveEffects.map((e, i) => {
                    const normalized = (isActive && bonusTracking) ? normalizeStatName(e.stat) : null;
                    const totalCount = normalized ? getTotalBonusCount(bonusTracking!, normalized, e.value) : 0;
                    const capped = normalized ? isBonusCapped(bonusTracking!, normalized, e.value) : false;
                    return (
                      <span key={i} className={capped ? 'text-orange-400 font-semibold' : ''}>
                        {i > 0 && ', '}
                        {e.stat} +{formatBonusValue(e.value)}
                        {isActive && totalCount > 0 && (
                          <span className={`ml-0.5 text-[9px] ${capped ? 'text-orange-400' : 'text-slate-500'}`}>
                            ({totalCount}/5)
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
              {pvpEffects.length > 0 && (
                <div className={`text-xs ${isActive ? 'text-red-400/60' : 'text-gray-600'}`}>
                  <span className="font-medium">{bonus.pieces}pc <span className="text-[9px] uppercase">(PvP)</span>:</span>{' '}
                  {pvpEffects.map((e) => `${e.stat} +${formatBonusValue(e.value)}`).join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
