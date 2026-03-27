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
import { calculateIncarnateDamage } from '@/data/at-tables';
import { useBuildStore } from '@/stores';

// ============================================
// EFFECT LABEL MAPS
// ============================================

const ALPHA_LABELS: Record<string, string> = {
  damage: 'Damage', accuracy: 'Accuracy', recharge: 'Recharge',
  enduranceReduction: 'End Reduction', enduranceModification: 'End Modification',
  range: 'Range', heal: 'Heal',
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
  damage: 'Damage', regeneration: 'Regeneration', recovery: 'Recovery',
  enduranceDiscount: 'End Discount', statusResistance: 'Status Resistance',
  resSmashing: 'Res (S)', resLethal: 'Res (L)', resFire: 'Res (F)',
  resCold: 'Res (C)', resEnergy: 'Res (E)', resNegative: 'Res (N)',
  resPsionic: 'Res (Psi)', resToxic: 'Res (Tox)',
  defMelee: 'Def (Melee)', defRanged: 'Def (Ranged)', defAoE: 'Def (AoE)',
  defSmashing: 'Def (S)', defLethal: 'Def (L)', defFire: 'Def (F)',
  defCold: 'Def (C)', defEnergy: 'Def (E)', defNegative: 'Def (N)',
  defPsionic: 'Def (Psi)', defToxic: 'Def (Tox)',
  protHold: 'Prot Hold', protStun: 'Prot Stun', protImmobilize: 'Prot Immobilize',
  protSleep: 'Prot Sleep', protConfuse: 'Prot Confuse', protFear: 'Prot Fear',
};

// ============================================
// STRUCTURED EFFECT DATA (for panel layouts)
// ============================================

export interface EffectEntry {
  label: string;
  value: string;
}

export interface EffectData {
  header: string;
  entries: EffectEntry[];
  footer?: string;
  tags?: string[];
}

/** Extract structured effect data for any incarnate slot/power */
export function getIncarnateEffectData(slotId: IncarnateSlotId, powerId: string, archetypeId?: string, level?: number): EffectData | null {
  switch (slotId) {
    case 'alpha': {
      const fx = getAlphaEffects(powerId);
      if (!fx) return null;
      const entries: EffectEntry[] = (Object.entries(fx) as [string, number][])
        .filter(([k]) => k !== 'levelShift' && k !== 'edBypass')
        .map(([k, v]) => ({ label: ALPHA_LABELS[k] || k, value: formatEffectValue(v) }));
      if (fx.levelShift !== undefined && fx.levelShift > 0)
        entries.push({ label: 'Level Shift', value: `+${fx.levelShift}` });
      return entries.length > 0 ? { header: 'Enhancement Bonuses', entries } : null;
    }
    case 'destiny': {
      const fx = getDestinyEffects(powerId);
      if (!fx) return null;
      const entries: EffectEntry[] = (Object.entries(fx) as [string, number][])
        .filter(([k]) => k !== 'levelShift' && k !== 'initialDuration' && k !== 'totalDuration')
        .map(([k, v]) => ({ label: DESTINY_LABELS[k] || k, value: k === 'mezProtection' ? `Mag ${v}` : formatEffectValue(v) }));
      if (fx.levelShift !== undefined && fx.levelShift > 0)
        entries.push({ label: 'Level Shift', value: `+${fx.levelShift}` });
      const footer = fx.totalDuration !== undefined ? `Duration: ${fx.totalDuration}s (peak ${fx.initialDuration}s)` : undefined;
      return { header: 'Stat Bonuses', entries, footer };
    }
    case 'hybrid': {
      const fx = getHybridEffects(powerId);
      if (!fx) return null;
      const entries: EffectEntry[] = [];
      // Passive bonuses
      for (const [stat, val] of Object.entries(fx.passive)) {
        entries.push({ label: `${HYBRID_LABELS[stat] || stat} (passive)`, value: formatEffectValue(val) });
      }
      // Front-loaded toggle bonuses
      for (const [stat, val] of Object.entries(fx.frontLoaded)) {
        const label = HYBRID_LABELS[stat] || stat;
        entries.push({ label, value: stat.startsWith('prot') ? `Mag ${val}` : formatEffectValue(val) });
      }
      // Per-target stacking
      if (Object.keys(fx.perTarget).length > 0) {
        for (const [stat, val] of Object.entries(fx.perTarget)) {
          entries.push({ label: `${HYBRID_LABELS[stat] || stat} /enemy`, value: `${formatEffectValue(val)} (max ${fx.maxTargets})` });
        }
      }
      const footer = `${fx.duration}s duration / ${fx.recharge}s recharge`;
      return { header: `${fx.tree.charAt(0).toUpperCase() + fx.tree.slice(1)} Hybrid`, entries, footer };
    }
    case 'interface': {
      const fx = getInterfaceEffects(powerId);
      if (!fx) return null;
      const entries: EffectEntry[] = [];
      if (fx.debuffType) entries.push({ label: fx.debuffType, value: formatEffectValue(-(fx.debuffMagnitude || 0)) });
      if (fx.dotType) {
        const dotDmg = fx.dotDamage && fx.dotTableName && archetypeId
          ? calculateIncarnateDamage(fx.dotDamage, fx.dotTableName, archetypeId, level ?? 50)
          : null;
        entries.push({ label: `DoT (${fx.dotType})`, value: dotDmg !== null ? `${dotDmg.toFixed(1)}` : `${((fx.dotDamage || 0) * 100).toFixed(0)}% scale` });
      }
      if (fx.procChance !== undefined) entries.push({ label: 'Proc Chance', value: `${(fx.procChance * 100).toFixed(0)}%` });
      return { header: 'Proc Effects', entries };
    }
    case 'judgement': {
      const fx = getJudgementEffects(powerId);
      if (!fx) return null;
      const dmg = archetypeId ? calculateIncarnateDamage(fx.damageScale, fx.tableName, archetypeId, level ?? 50) : null;
      const entries: EffectEntry[] = [
        { label: `Damage (${fx.damageType})`, value: dmg !== null ? `${dmg.toFixed(1)}` : `${fx.damageScale} scale` },
        { label: 'Area', value: fx.effectArea },
      ];
      if (fx.range > 0) entries.push({ label: 'Range', value: `${fx.range}ft` });
      if (fx.radius > 0) entries.push({ label: 'Radius', value: `${fx.radius}ft` });
      if (fx.arc > 0) entries.push({ label: 'Arc', value: `${fx.arc}\u00B0` });
      if (fx.maxTargets > 0) entries.push({ label: 'Max Targets', value: `${fx.maxTargets}` });
      entries.push({ label: 'Recharge', value: `${fx.rechargeTime}s` });
      const tags = fx.secondaryEffects.length > 0 ? fx.secondaryEffects : undefined;
      return { header: 'Attack', entries, tags };
    }
    case 'lore': {
      const fx = getLoreEffects(powerId);
      if (!fx) return null;
      const entries: EffectEntry[] = [
        { label: 'Faction', value: fx.faction },
        { label: 'Duration', value: `${Math.round(fx.duration / 60)}min` },
        { label: 'Recharge', value: `${Math.round(fx.rechargeTime / 60)}min` },
      ];
      return { header: 'Summon Pets', entries, tags: fx.pets };
    }
    default:
      return null;
  }
}

// ============================================
// IncarnateEffectsTooltip
// ============================================

export function IncarnateEffectsTooltip({ slotId, powerId }: { slotId: IncarnateSlotId; powerId: string }) {
  const build = useBuildStore((s) => s.build);
  const archetypeId = build.archetype.id ?? '';
  const level = build.level;

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
      return <HybridTooltip fx={fx} powerId={powerId} archetypeId={archetypeId} level={level} />;
    }
    case 'interface': {
      const fx = getInterfaceEffects(powerId);
      if (!fx) return null;
      return <InterfaceTooltip fx={fx} archetypeId={archetypeId} level={level} />;
    }
    case 'judgement': {
      const fx = getJudgementEffects(powerId);
      if (!fx) return null;
      return <JudgementTooltip fx={fx} archetypeId={archetypeId} level={level} />;
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

const HYBRID_TARGET_INFO: Record<string, { label: string; color: string }> = {
  assault: { label: 'Self', color: 'text-blue-400' },
  control: { label: 'Self', color: 'text-blue-400' },
  melee: { label: 'Self', color: 'text-blue-400' },
  support: { label: 'Team (50ft aura, affects pets)', color: 'text-green-400' },
};

function HybridTooltip({ fx, powerId }: { fx: HybridEffects; powerId: string; archetypeId: string; level: number }) {
  const targetInfo = HYBRID_TARGET_INFO[fx.tree] || HYBRID_TARGET_INFO[powerId.split('_')[0]];

  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">{fx.tree.charAt(0).toUpperCase() + fx.tree.slice(1)} Hybrid</div>
      {targetInfo && (
        <div className={`text-[10px] ${targetInfo.color} mb-0.5`}>Target: {targetInfo.label}</div>
      )}
      {Object.keys(fx.passive).length > 0 && (
        <>
          <div className="text-gray-400 text-[10px] font-semibold mt-1">Passive (always-on)</div>
          {Object.entries(fx.passive).map(([stat, val]) => (
            <EffectRow key={`p-${stat}`} label={HYBRID_LABELS[stat] || stat} value={formatEffectValue(val)} />
          ))}
        </>
      )}
      {Object.keys(fx.frontLoaded).length > 0 && (
        <>
          <div className="text-gray-400 text-[10px] font-semibold mt-1">Toggle (baseline)</div>
          {Object.entries(fx.frontLoaded).map(([stat, val]) => (
            <EffectRow key={`f-${stat}`} label={HYBRID_LABELS[stat] || stat} value={stat.startsWith('prot') ? `Mag ${val}` : formatEffectValue(val)} />
          ))}
        </>
      )}
      {Object.keys(fx.perTarget).length > 0 && (
        <>
          <div className="text-gray-400 text-[10px] font-semibold mt-1">Per enemy (max {fx.maxTargets})</div>
          {Object.entries(fx.perTarget).map(([stat, val]) => (
            <EffectRow key={`t-${stat}`} label={HYBRID_LABELS[stat] || stat} value={formatEffectValue(val)} />
          ))}
        </>
      )}
      <div className="text-gray-500 text-[10px] mt-1">
        {fx.duration}s duration / {fx.recharge}s recharge
      </div>
    </div>
  );
}

function InterfaceTooltip({ fx, archetypeId, level }: { fx: InterfaceEffects; archetypeId: string; level: number }) {
  const dotDmg = fx.dotDamage && fx.dotTableName
    ? calculateIncarnateDamage(fx.dotDamage, fx.dotTableName, archetypeId, level)
    : null;
  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Proc Effects</div>
      {fx.debuffType && (
        <EffectRow label={fx.debuffType} value={formatEffectValue(-(fx.debuffMagnitude || 0))} />
      )}
      {fx.dotType && (
        <EffectRow
          label={`DoT (${fx.dotType})`}
          value={dotDmg !== null ? `${dotDmg.toFixed(1)}` : `${((fx.dotDamage || 0) * 100).toFixed(0)}% scale`}
        />
      )}
      {fx.procChance !== undefined && (
        <EffectRow label="Proc Chance" value={`${(fx.procChance * 100).toFixed(0)}%`} />
      )}
    </div>
  );
}

function JudgementTooltip({ fx, archetypeId, level }: { fx: JudgementEffects; archetypeId: string; level: number }) {
  const damage = calculateIncarnateDamage(fx.damageScale, fx.tableName, archetypeId, level);
  return (
    <div className="text-[11px] mt-2 border-t border-gray-600 pt-1.5 space-y-0.5">
      <div className="text-cyan-400 font-semibold mb-0.5">Attack</div>
      <EffectRow
        label={`Damage (${fx.damageType})`}
        value={damage !== null ? `${damage.toFixed(1)}` : `${fx.damageScale} scale`}
      />
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
