/**
 * IncarnatePowerTree component - displays the power tree for a specific incarnate tree
 * Shows powers organized by tier in a 5-column tree structure:
 *
 * Row 4 (Very Rare):  [Core]  [ ]  [ ]  [ ]  [Radial]   (columns 1, 5)
 * Row 3 (Rare):       [TC] [PC]  [ ]  [PR] [TR]         (columns 1-2, 4-5)
 * Row 2 (Uncommon):   [ ]  [Core]  [ ]  [Radial]  [ ]   (columns 2, 4)
 * Row 1 (Common):     [ ]  [ ]  [Base]  [ ]  [ ]        (column 3)
 */

import type { IncarnateSlotId, IncarnatePower, IncarnateTier } from '@/types';
import {
  getIncarnateIconPath,
  getTierColor,
  getTierDisplayName,
  abbreviatePowerName,
  resolveTreeRow,
  STANDARD_TREE_LAYOUT,
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getJudgementEffects,
  getLoreEffects,
  formatEffectValue,
} from '@/data';
import type { AlphaEffects, DestinyEffects, HybridEffects, InterfaceEffects, JudgementEffects, LoreEffects } from '@/data';
import { Tooltip } from '@/components/ui';

interface IncarnatePowerTreeProps {
  slotId: IncarnateSlotId;
  treeId: string;
  treeName: string;
  powers: IncarnatePower[];
  selectedPowerId: string | null;
  onSelectPower: (power: IncarnatePower | null) => void;
}

export function IncarnatePowerTree({
  slotId,
  treeId: _treeId,
  treeName,
  powers,
  selectedPowerId,
  onSelectPower,
}: IncarnatePowerTreeProps) {
  void _treeId;

  // Group powers by tier and branch
  const powersByTierAndBranch = powers.reduce(
    (acc, power) => {
      if (!acc[power.tier]) {
        acc[power.tier] = {};
      }
      if (!acc[power.tier][power.branch]) {
        acc[power.tier][power.branch] = [];
      }
      acc[power.tier][power.branch].push(power);
      return acc;
    },
    {} as Record<string, Record<string, IncarnatePower[]>>
  );

  const handlePowerClick = (power: IncarnatePower) => {
    if (selectedPowerId === power.id || selectedPowerId === power.fullName) {
      onSelectPower(null);
    } else {
      onSelectPower(power);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Tree header */}
      <div className="text-center pb-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">{treeName}</h3>
      </div>

      {/* 5-column tree grid - driven by STANDARD_TREE_LAYOUT */}
      <div className="flex flex-col items-center gap-2 py-4">
        {STANDARD_TREE_LAYOUT.rows.map(({ tier, layout }) => {
          const resolvedPowers = resolveTreeRow(layout, powersByTierAndBranch);
          const hasAnyPower = resolvedPowers.some((p) => p !== null);
          if (!hasAnyPower) return null;

          return (
            <TreeRow
              key={tier}
              tier={tier}
              slots={resolvedPowers}
              slotId={slotId}
              treeName={treeName}
              selectedPowerId={selectedPowerId}
              onPowerClick={handlePowerClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TreeRowProps {
  tier: IncarnateTier;
  slots: (IncarnatePower | null)[];
  slotId: IncarnateSlotId;
  treeName: string;
  selectedPowerId: string | null;
  onPowerClick: (power: IncarnatePower) => void;
}

function TreeRow({ tier, slots, slotId, treeName, selectedPowerId, onPowerClick }: TreeRowProps) {
  const tierColor = getTierColor(tier);
  const tierName = getTierDisplayName(tier);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Tier label */}
      <div
        className="text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: tierColor }}
      >
        {tierName}
      </div>

      {/* 5-column grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 w-full max-w-[420px]">
        {slots.map((power, index) => (
          <div key={index} className="flex justify-center">
            {power ? (
              <PowerButton
                slotId={slotId}
                power={power}
                treeName={treeName}
                isSelected={selectedPowerId === power.id || selectedPowerId === power.fullName}
                onClick={() => onPowerClick(power)}
              />
            ) : (
              <div className="w-[56px] h-[56px] sm:w-[76px] sm:h-[76px]" /> // Empty placeholder
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PowerButtonProps {
  slotId: IncarnateSlotId;
  power: IncarnatePower;
  treeName: string;
  isSelected: boolean;
  onClick: () => void;
}

function PowerButton({ slotId, power, treeName, isSelected, onClick }: PowerButtonProps) {
  const tierColor = getTierColor(power.tier);
  const iconPath = getIncarnateIconPath(slotId, power.icon);
  const shortName = abbreviatePowerName(power.displayName, treeName);
  const branchLabel = power.branch === 'base' ? 'Base' : power.branch === 'core' ? 'Core' : 'Radial';

  const tooltipContent = (
    <div className="max-w-[300px]">
      <div className="font-semibold text-white">{power.displayName}</div>
      <div className="text-xs mt-1" style={{ color: tierColor }}>
        {getTierDisplayName(power.tier)} - {branchLabel}
      </div>
      {power.shortHelp && (
        <div className="text-xs text-gray-400 mt-1">{power.shortHelp}</div>
      )}
      <IncarnateEffectsTooltip slotId={slotId} powerId={power.id} />
      {isSelected && (
        <div className="text-xs text-yellow-400 mt-2 italic">Click again to deselect</div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      <button
        onClick={onClick}
        className={`
          relative flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 rounded-lg
          transition-all duration-200 w-[56px] sm:w-[76px]
          ${
            isSelected
              ? 'bg-gray-700/70 ring-2 ring-offset-1 ring-offset-gray-900'
              : 'bg-gray-800/50 hover:bg-gray-700/50'
          }
        `}
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: isSelected ? tierColor : '#374151',
          boxShadow: isSelected ? `0 0 12px ${tierColor}60` : 'none',
        }}
      >
        {/* Icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden">
          <img
            src={iconPath}
            alt={power.displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/Unknown.png';
            }}
          />
        </div>

        {/* Power name */}
        <div className="text-center">
          <div className="text-[7px] sm:text-[8px] text-gray-300 leading-tight truncate max-w-[48px] sm:max-w-[68px]">
            {shortName}
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>
    </Tooltip>
  );
}

// ============================================
// EFFECT LABEL MAPS
// ============================================

const ALPHA_LABELS: Record<string, string> = {
  damage: 'Damage', accuracy: 'Accuracy', recharge: 'Recharge',
  enduranceReduction: 'End Reduction', range: 'Range', heal: 'Heal',
  defense: 'Defense', resistance: 'Resistance', hold: 'Hold',
  immobilize: 'Immobilize', stun: 'Stun', sleep: 'Sleep',
  fear: 'Fear', confuse: 'Confuse', slow: 'Slow',
  toHitDebuff: 'ToHit Debuff', defenseDebuff: 'Defense Debuff',
  toHitBuff: 'ToHit Buff', taunt: 'Taunt',
  runSpeed: 'Run Speed', jumpSpeed: 'Jump Speed', flySpeed: 'Fly Speed',
  absorb: 'Absorb',
};

const DESTINY_LABELS: Record<string, string> = {
  defenseAll: 'Defense (All)', resistanceAll: 'Resistance (All)',
  healPercent: 'Heal', recovery: 'Recovery', regeneration: 'Regeneration',
  maxHP: 'Max HP', maxEndurance: 'Max End', recharge: 'Recharge',
  damage: 'Damage', toHit: 'ToHit', mezProtection: 'Mez Protection',
};

const HYBRID_LABELS: Record<string, string> = {
  damage: 'Damage', damageProc: 'Damage Proc', doublehitChance: 'Double Hit',
  defense: 'Defense', accuracy: 'Accuracy',
  regeneration: 'Regeneration', resistanceAll: 'Resistance (All)',
  defenseAll: 'Defense (All)', statusProtection: 'Status Protection',
  mezMagnitudeBonus: 'Mez Magnitude',
};

// ============================================
// IncarnateEffectsTooltip
// ============================================

function IncarnateEffectsTooltip({ slotId, powerId }: { slotId: IncarnateSlotId; powerId: string }) {
  switch (slotId) {
    case 'alpha': {
      const fx = getAlphaEffects(powerId);
      if (!fx) return null;
      return <AlphaTooltip fx={fx} />;
    }
    case 'destiny': {
      const fx = getDestinyEffects(powerId);
      if (!fx) return null;
      return <DestinyTooltip fx={fx} />;
    }
    case 'hybrid': {
      const fx = getHybridEffects(powerId);
      if (!fx) return null;
      return <HybridTooltip fx={fx} />;
    }
    case 'interface': {
      const fx = getInterfaceEffects(powerId);
      if (!fx) return null;
      return <InterfaceTooltip fx={fx} />;
    }
    case 'judgement': {
      const fx = getJudgementEffects(powerId);
      if (!fx) return null;
      return <JudgementTooltip fx={fx} />;
    }
    case 'lore': {
      const fx = getLoreEffects(powerId);
      if (!fx) return null;
      return <LoreTooltip fx={fx} />;
    }
    default:
      return null;
  }
}

function EffectRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-400">{label}</span>
      <span className="text-cyan-300">{value}</span>
    </div>
  );
}

function AlphaTooltip({ fx }: { fx: AlphaEffects }) {
  const entries = Object.entries(fx).filter(
    ([k]) => k !== 'levelShift' && k !== 'edBypass'
  ) as [string, number][];
  if (entries.length === 0 && !fx.levelShift) return null;

  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Enhancement Bonuses</div>
      {entries.map(([key, val]) => (
        <EffectRow key={key} label={ALPHA_LABELS[key] || key} value={formatEffectValue(val)} />
      ))}
      {fx.levelShift !== undefined && fx.levelShift > 0 && (
        <EffectRow label="Level Shift" value={`+${fx.levelShift}`} />
      )}
    </div>
  );
}

function DestinyTooltip({ fx }: { fx: DestinyEffects }) {
  const statEntries = Object.entries(fx).filter(
    ([k]) => k !== 'levelShift' && k !== 'initialDuration' && k !== 'totalDuration'
  ) as [string, number][];

  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Stat Bonuses</div>
      {statEntries.map(([key, val]) => (
        <EffectRow
          key={key}
          label={DESTINY_LABELS[key] || key}
          value={key === 'mezProtection' ? `Mag ${val}` : formatEffectValue(val)}
        />
      ))}
      {fx.levelShift !== undefined && fx.levelShift > 0 && (
        <EffectRow label="Level Shift" value={`+${fx.levelShift}`} />
      )}
      {fx.totalDuration !== undefined && (
        <div className="text-gray-500 text-[10px] mt-1">
          Duration: {fx.totalDuration}s (peak {fx.initialDuration}s)
        </div>
      )}
    </div>
  );
}

function HybridTooltip({ fx }: { fx: HybridEffects }) {
  const statEntries = Object.entries(fx).filter(
    ([k]) => k !== 'duration' && k !== 'recharge'
  ) as [string, number][];

  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Toggle Bonuses</div>
      {statEntries.map(([key, val]) => (
        <EffectRow
          key={key}
          label={HYBRID_LABELS[key] || key}
          value={
            key === 'statusProtection' ? `Mag ${val}` :
            key === 'mezMagnitudeBonus' ? `+${val} Mag` :
            formatEffectValue(val)
          }
        />
      ))}
      {fx.duration !== undefined && (
        <div className="text-gray-500 text-[10px] mt-1">
          {fx.duration}s duration / {fx.recharge}s recharge
        </div>
      )}
    </div>
  );
}

function InterfaceTooltip({ fx }: { fx: InterfaceEffects }) {
  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Proc Effects</div>
      {fx.debuffType && (
        <EffectRow label={fx.debuffType} value={formatEffectValue(-(fx.debuffMagnitude || 0))} />
      )}
      {fx.dotType && (
        <EffectRow label={`DoT (${fx.dotType})`} value={`${((fx.dotDamage || 0) * 100).toFixed(0)}% base`} />
      )}
      {fx.procChance !== undefined && (
        <EffectRow label="Proc Chance" value={`${(fx.procChance * 100).toFixed(0)}%`} />
      )}
    </div>
  );
}

function JudgementTooltip({ fx }: { fx: JudgementEffects }) {
  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Attack</div>
      <EffectRow label="Damage" value={fx.damageType} />
      <EffectRow label="Area" value={fx.effectArea} />
      {fx.range > 0 && <EffectRow label="Range" value={`${fx.range}ft`} />}
      {fx.radius > 0 && <EffectRow label="Radius" value={`${fx.radius}ft`} />}
      {fx.arc > 0 && <EffectRow label="Arc" value={`${fx.arc}\u00B0`} />}
      {fx.maxTargets > 0 && <EffectRow label="Max Targets" value={`${fx.maxTargets}`} />}
      <EffectRow label="Recharge" value={`${fx.rechargeTime}s`} />
      {fx.secondaryEffects.length > 0 && (
        <div className="text-gray-400 mt-1">
          {fx.secondaryEffects.map((e, i) => (
            <span key={i} className="inline-block bg-gray-700 rounded px-1 mr-1 mb-0.5 text-[10px]">{e}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function LoreTooltip({ fx }: { fx: LoreEffects }) {
  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Summon Pets</div>
      <EffectRow label="Faction" value={fx.faction} />
      <div className="text-gray-400">
        {fx.pets.map((p, i) => (
          <span key={i} className="inline-block bg-gray-700 rounded px-1 mr-1 mb-0.5 text-[10px]">{p}</span>
        ))}
      </div>
      <EffectRow label="Duration" value={`${Math.round(fx.duration / 60)}min`} />
      <EffectRow label="Recharge" value={`${Math.round(fx.rechargeTime / 60)}min`} />
    </div>
  );
}
