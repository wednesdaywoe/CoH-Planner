/**
 * SetBonusDisplay component - shows active set bonuses
 */

import { useActiveSetBonuses } from '@/hooks';
import { Tooltip, Badge } from '@/components/ui';
import type { SetBonus } from '@/types';

export function SetBonusDisplay() {
  const activeBonuses = useActiveSetBonuses();

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
        />
      ))}
    </div>
  );
}

interface SetBonusItemProps {
  setName: string;
  piecesSlotted: number;
  bonuses: SetBonus[];
}

function SetBonusItem({ setName, piecesSlotted, bonuses }: SetBonusItemProps) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-yellow-400">{setName}</span>
        <Badge variant="primary" size="sm">{piecesSlotted} pcs</Badge>
      </div>
      <div className="space-y-1">
        {bonuses.map((bonus, index) => (
          <BonusRow key={index} bonus={bonus} isActive={bonus.pieces <= piecesSlotted} />
        ))}
      </div>
    </div>
  );
}

interface BonusRowProps {
  bonus: SetBonus;
  isActive: boolean;
}

function BonusRow({ bonus, isActive }: BonusRowProps) {
  return (
    <Tooltip
      content={
        <div>
          <div className="font-medium">Requires {bonus.pieces} pieces</div>
          <div className="mt-1 space-y-0.5">
            {bonus.effects.map((effect, i) => (
              <div key={i} className="text-sm">
                {effect.stat}: +{effect.value}
                {typeof effect.value === 'number' && effect.value < 1 ? '' : '%'}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div
        className={`
          flex items-center justify-between text-xs py-0.5
          ${isActive ? 'text-green-400' : 'text-gray-500'}
        `}
      >
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
          {bonus.pieces}pc:
        </span>
        <span className="truncate ml-2">
          {bonus.effects.map((e) => e.stat).join(', ')}
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
}

export function SetBonusSummary({
  setName,
  totalPieces,
  slottedPieces,
  bonuses,
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
          return (
            <div
              key={index}
              className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}
            >
              <span className="font-medium">{bonus.pieces}pc:</span>{' '}
              {bonus.effects.map((e) => `${e.stat} +${e.value}`).join(', ')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
