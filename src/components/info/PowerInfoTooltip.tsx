/**
 * PowerInfoTooltip - Floating tooltip that displays power info on hover
 * Shows all power stats EXCEPT the description (for compact display)
 * Remains responsive to hover changes even when info panel is locked
 */

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, useBuildStore } from '@/stores';
import { getPower, getPowerPool, getArchetype } from '@/data';
import type { DefenseByType, ResistanceByType, ProtectionEffects, ArchetypeId } from '@/types';

// Base value for buff/debuff effects (per scale point at modifier 1.0)
const BASE_BUFF_DEBUFF = 0.10;

function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
  const powersetArchetype = powerSet.split('/')[0];
  if (powersetArchetype === 'defender' || powersetArchetype === 'controller') {
    return archetypeModifier;
  }
  if (powersetArchetype === 'corruptor' || powersetArchetype === 'mastermind') {
    return 1.0;
  }
  return 1.0;
}

function calculateBuffDebuffValue(scale: number, effectiveModifier: number): number {
  return scale * BASE_BUFF_DEBUFF * effectiveModifier;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Compact defense/resistance display
function DefenseResistanceCompact({
  label,
  values,
  colorClass
}: {
  label: string;
  values: DefenseByType | ResistanceByType;
  colorClass: string;
}) {
  const entries = Object.entries(values).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[9px] uppercase">{label}</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[9px]">{type}</span>
            <span className={`${colorClass} text-[9px]`}>{formatPercent(value as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact mez protection display
function ProtectionCompact({ protection }: { protection: ProtectionEffects }) {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[9px] uppercase">Mez Protection</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[9px]">{type}</span>
            <span className="text-purple-400 text-[9px]">Mag {(value as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PowerInfoContentProps {
  powerName: string;
  powerSet: string;
}

function PowerInfoContent({ powerName, powerSet }: PowerInfoContentProps) {
  const archetypeId = useBuildStore((s) => s.build.archetype.id);

  // Try to get power from powerset first, then from pools
  let power = getPower(powerSet, powerName);

  if (!power) {
    const pool = getPowerPool(powerSet);
    if (pool) {
      power = pool.powers.find((p) => p.name === powerName);
    }
  }

  if (!power) {
    return <div className="text-slate-500 text-[10px]">Power not found</div>;
  }

  const effects = power.effects;

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;
  const effectiveMod = getEffectiveBuffDebuffModifier(powerSet, buffDebuffMod);

  // Check for damage
  const hasDamage = effects?.damage && (
    'type' in effects.damage
      ? effects.damage.scale > 0
      : effects.damage.types?.length > 0
  );

  // Check for mez effects
  const hasMez = effects?.stun || effects?.hold || effects?.immobilize ||
                 effects?.sleep || effects?.fear || effects?.confuse || effects?.knockback;

  // Check for buffs/debuffs
  const hasBuffs = effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff;
  const hasDebuffs = effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff;

  return (
    <div className="space-y-1.5 max-w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <img
          src={power.icon || '/img/Unknown.png'}
          alt=""
          className="w-6 h-6 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/Unknown.png';
          }}
        />
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-blue-400 leading-tight">{power.name}</h3>
          <span className="text-[9px] text-slate-400 capitalize">{power.powerType}</span>
        </div>
      </div>

      {/* Short Help */}
      {power.shortHelp && (
        <div className="text-[9px] text-amber-400/80 italic">
          {power.shortHelp}
        </div>
      )}

      {/* Base Stats - compact */}
      {effects && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0 text-[10px]">
          {effects.accuracy && (
            <div className="flex justify-between">
              <span className="text-slate-400">Acc</span>
              <span className="text-yellow-400">{formatPercent(effects.accuracy)}</span>
            </div>
          )}
          {effects.recharge && (
            <div className="flex justify-between">
              <span className="text-slate-400">Rech</span>
              <span className="text-blue-400">{effects.recharge.toFixed(1)}s</span>
            </div>
          )}
          {effects.enduranceCost && (
            <div className="flex justify-between">
              <span className="text-slate-400">End</span>
              <span className="text-cyan-400">{effects.enduranceCost.toFixed(2)}</span>
            </div>
          )}
          {effects.castTime && (
            <div className="flex justify-between">
              <span className="text-slate-400">Cast</span>
              <span className="text-slate-300">{effects.castTime.toFixed(2)}s</span>
            </div>
          )}
          {effects.range !== undefined && effects.range > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Range</span>
              <span className="text-slate-300">{effects.range}ft</span>
            </div>
          )}
          {effects.radius && (
            <div className="flex justify-between">
              <span className="text-slate-400">Radius</span>
              <span className="text-slate-300">{effects.radius}ft</span>
            </div>
          )}
          {effects.buffDuration && (
            <div className="flex justify-between">
              <span className="text-slate-400">Dur</span>
              <span className="text-slate-300">{effects.buffDuration.toFixed(1)}s</span>
            </div>
          )}
        </div>
      )}

      {/* Damage */}
      {hasDamage && effects?.damage && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Damage: </span>
          {'type' in effects.damage ? (
            <span className="text-red-400">{effects.damage.type} {(effects.damage.scale ?? 0).toFixed(2)}</span>
          ) : (
            effects.damage.types?.map((d, i) => (
              <span key={i} className="text-red-400">
                {i > 0 && ' + '}{d.type} {(d.scale ?? 0).toFixed(2)}
              </span>
            ))
          )}
        </div>
      )}

      {/* DoT */}
      {effects?.dot && effects.dot.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">DoT: </span>
          <span className="text-orange-400">{effects.dot.type} {effects.dot.scale.toFixed(2)}/tick x {effects.dot.ticks}</span>
        </div>
      )}

      {/* Healing */}
      {effects?.healing && effects.healing.scale != null && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Heal: </span>
          <span className="text-green-400">{effects.healing.scale.toFixed(2)} scale</span>
        </div>
      )}

      {/* Mez Effects - inline */}
      {hasMez && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Mez: </span>
          {effects?.stun && <span className="text-purple-400">Stun {effects.stun}{effects.stunDuration ? `(${effects.stunDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.hold && <span className="text-purple-400">Hold {effects.hold}{effects.holdDuration ? `(${effects.holdDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.immobilize && <span className="text-purple-400">Immob {effects.immobilize}{effects.immobilizeDuration ? `(${effects.immobilizeDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.sleep && <span className="text-purple-400">Sleep {effects.sleep}{effects.sleepDuration ? `(${effects.sleepDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.fear && <span className="text-purple-400">Fear {effects.fear}{effects.fearDuration ? `(${effects.fearDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.confuse && <span className="text-purple-400">Confuse {effects.confuse}{effects.confuseDuration ? `(${effects.confuseDuration.toFixed(1)}s)` : ''} </span>}
          {effects?.knockback && <span className="text-purple-400">KB {effects.knockback} </span>}
        </div>
      )}

      {/* Buffs */}
      {hasBuffs && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Buffs: </span>
          {effects?.tohitBuff && <span className="text-green-400">ToHit +{formatPercent(calculateBuffDebuffValue(effects.tohitBuff, effectiveMod))} </span>}
          {effects?.damageBuff && <span className="text-green-400">Dmg +{formatPercent(calculateBuffDebuffValue(effects.damageBuff, effectiveMod))} </span>}
          {effects?.defenseBuff && <span className="text-green-400">Def +{formatPercent(calculateBuffDebuffValue(effects.defenseBuff, effectiveMod))} </span>}
        </div>
      )}

      {/* Debuffs */}
      {hasDebuffs && (
        <div className="text-[10px]">
          <span className="text-slate-400 text-[9px] uppercase">Debuffs: </span>
          {effects?.tohitDebuff && <span className="text-red-400">ToHit -{formatPercent(calculateBuffDebuffValue(effects.tohitDebuff, effectiveMod))} </span>}
          {effects?.defenseDebuff && <span className="text-red-400">Def -{formatPercent(calculateBuffDebuffValue(effects.defenseDebuff, effectiveMod))} </span>}
          {effects?.resistanceDebuff && <span className="text-red-400">Res -{formatPercent(calculateBuffDebuffValue(effects.resistanceDebuff, effectiveMod))} </span>}
        </div>
      )}

      {/* Defense (armor sets) */}
      {effects?.defense && (
        <DefenseResistanceCompact
          label="Defense"
          values={effects.defense}
          colorClass="text-purple-400"
        />
      )}

      {/* Resistance (armor sets) */}
      {effects?.resistance && (
        <DefenseResistanceCompact
          label="Resistance"
          values={effects.resistance}
          colorClass="text-orange-400"
        />
      )}

      {/* Mez Protection (armor sets) */}
      {effects?.protection && (
        <ProtectionCompact protection={effects.protection} />
      )}
    </div>
  );
}

export function PowerInfoTooltip() {
  const tooltipEnabled = useUIStore((s) => s.infoPanel.tooltipEnabled);
  const infoPanelContent = useUIStore((s) => s.infoPanel.content);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Position tooltip to the right and slightly below cursor
    const x = e.clientX + 15;
    const y = e.clientY + 10;

    // Keep tooltip within viewport
    const maxX = window.innerWidth - 300; // tooltip width estimate
    const maxY = window.innerHeight - 400; // tooltip height estimate

    setPosition({
      x: Math.min(x, maxX),
      y: Math.min(y, maxY),
    });
  }, []);

  useEffect(() => {
    if (tooltipEnabled && infoPanelContent?.type === 'power') {
      setVisible(true);
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
      setVisible(false);
    }
  }, [tooltipEnabled, infoPanelContent, handleMouseMove]);

  if (!visible || !infoPanelContent || infoPanelContent.type !== 'power') {
    return null;
  }

  return createPortal(
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="bg-slate-900/95 border border-slate-600 rounded-lg shadow-xl p-2">
        <PowerInfoContent
          powerName={infoPanelContent.powerName}
          powerSet={infoPanelContent.powerSet}
        />
      </div>
    </div>,
    document.body
  );
}
