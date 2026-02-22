/**
 * Shared incarnate effects tooltip component.
 * Renders effect details for any incarnate slot type within a tooltip.
 */

import type { IncarnateSlotId } from '@/types';
import type { AlphaEffects, DestinyEffects, HybridEffects, InterfaceEffects, JudgementEffects, LoreEffects } from '@/data';
import {
  getAlphaEffects,
  getDestinyEffects,
  getHybridEffects,
  getInterfaceEffects,
  getJudgementEffects,
  getLoreEffects,
  formatEffectValue,
} from '@/data';

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

export function IncarnateEffectsTooltip({ slotId, powerId }: { slotId: IncarnateSlotId; powerId: string }) {
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
