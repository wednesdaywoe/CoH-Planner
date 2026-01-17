/**
 * InfoPanel - Displays detailed information about the currently hovered power
 * Renders inline within the Info Panel column (column headers are in PlannerPage)
 */

import { useUIStore, useBuildStore } from '@/stores';
import { getPower, getPowerPool, getArchetype } from '@/data';
import type { DefenseByType, ResistanceByType, ProtectionEffects, ArchetypeId } from '@/types';

// Base value for buff/debuff effects (per scale point at modifier 1.0)
// Formula: scale × BASE × archetypeModifier
// Example: Defender (1.25 mod) with scale 2.5 = 2.5 × 0.10 × 1.25 = 31.25%
// Example: Corruptor (1.0 mod for secondary) with scale 2.5 = 2.5 × 0.10 × 1.0 = 25%
const BASE_BUFF_DEBUFF = 0.10; // 10% per scale point at modifier 1.0

/**
 * Get the effective buff/debuff modifier for the powerset
 * - Defender/Controller PRIMARY support: uses their full buffDebuffModifier
 * - Corruptor/Mastermind SECONDARY support: uses 1.0 (base rate, not their primary modifier)
 * - Others: uses 1.0
 */
function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
  const powersetArchetype = powerSet.split('/')[0];

  // Defender and Controller have support as PRIMARY - use full modifier
  if (powersetArchetype === 'defender' || powersetArchetype === 'controller') {
    return archetypeModifier;
  }

  // Corruptor and Mastermind have support as SECONDARY - use base rate (1.0)
  // Their buffDebuffModifier (0.75) applies to their primary blast damage, not secondary support
  if (powersetArchetype === 'corruptor' || powersetArchetype === 'mastermind') {
    return 1.0;
  }

  // Pool powers and others use base rate
  return 1.0;
}

/**
 * Calculate the actual buff/debuff percentage value
 * Formula: scale × base × effectiveModifier
 */
function calculateBuffDebuffValue(
  scale: number,
  effectiveModifier: number
): number {
  return scale * BASE_BUFF_DEBUFF * effectiveModifier;
}

export function InfoPanel() {
  const infoPanel = useUIStore((s) => s.infoPanel);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);

  // If locked, show locked content; otherwise show hover content
  const content = infoPanel.locked ? infoPanel.lockedContent : infoPanel.content;

  if (!content) {
    return (
      <div className="text-slate-500 text-xs text-center py-8 italic">
        Hover over a power to see details
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Lock indicator */}
      {infoPanel.locked && (
        <button
          onClick={unlockInfoPanel}
          className="absolute top-0 right-0 text-amber-400 hover:text-amber-300 p-1 z-10"
          title="Click to unlock (allow hover updates)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {content.type === 'power' && (
        <PowerInfo powerName={content.powerName} powerSet={content.powerSet} />
      )}

      {content.type === 'enhancement' && (
        <EnhancementInfo enhancementId={content.enhancementId} />
      )}
    </div>
  );
}

interface PowerInfoProps {
  powerName: string;
  powerSet: string;
}

// Helper to format percentage values
function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Helper to display defense/resistance by type
function DefenseResistanceDisplay({
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
      <span className="text-slate-400 text-[10px] uppercase">{label}</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[10px]">{type}</span>
            <span className={`${colorClass} text-[10px]`}>{formatPercent(value as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to display mez protection
function ProtectionDisplay({ protection }: { protection: ProtectionEffects }) {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <span className="text-slate-400 text-[10px] uppercase">Mez Protection</span>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
        {entries.map(([type, value]) => (
          <div key={type} className="flex justify-between">
            <span className="text-slate-500 capitalize text-[10px]">{type}</span>
            <span className="text-purple-400 text-[10px]">Mag {(value as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PowerInfo({ powerName, powerSet }: PowerInfoProps) {
  const archetypeId = useBuildStore((s) => s.build.archetype.id);

  // Try to get power from powerset first, then from pools
  let power = getPower(powerSet, powerName);

  if (!power) {
    // Try pool powers
    const pool = getPowerPool(powerSet);
    if (pool) {
      power = pool.powers.find((p) => p.name === powerName);
    }
  }

  if (!power) {
    return <div className="text-slate-500 text-xs">Power not found</div>;
  }

  const effects = power.effects;

  // Get archetype modifier for buff/debuff calculations
  const archetype = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const buffDebuffMod = archetype?.stats?.buffDebuffModifier ?? 1.0;

  // Get the effective buff/debuff modifier for this powerset
  const effectiveMod = getEffectiveBuffDebuffModifier(powerSet, buffDebuffMod);

  // Check for damage (single or multi-type)
  const hasDamage = effects?.damage && (
    'type' in effects.damage
      ? effects.damage.scale > 0
      : effects.damage.types?.length > 0
  );

  // Check for mez effects
  const hasMez = effects?.stun || effects?.hold || effects?.immobilize ||
                 effects?.sleep || effects?.fear || effects?.confuse || effects?.knockback;

  // Check for buffs
  const hasBuffs = effects?.tohitBuff || effects?.damageBuff || effects?.defenseBuff;

  // Check for debuffs
  const hasDebuffs = effects?.tohitDebuff || effects?.defenseDebuff || effects?.resistanceDebuff;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-start gap-2">
        <img
          src={power.icon || '/img/Unknown.png'}
          alt=""
          className="w-8 h-8 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/Unknown.png';
          }}
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-blue-400 leading-tight">{power.name}</h3>
          <span className="text-[10px] text-slate-400 capitalize">{power.powerType}</span>
        </div>
      </div>

      {/* Short Help (quick summary) */}
      {power.shortHelp && (
        <div className="text-[10px] text-amber-400/80 italic">
          {power.shortHelp}
        </div>
      )}

      {/* Description */}
      <div>
        <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
          Description
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: power.description.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') }}
        />
      </div>

      {/* Base Stats */}
      {effects && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Base Stats
          </h4>
          <div className="space-y-0.5 text-xs">
            {effects.accuracy && (
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy</span>
                <span className="text-yellow-400">{formatPercent(effects.accuracy)}</span>
              </div>
            )}
            {effects.recharge && (
              <div className="flex justify-between">
                <span className="text-slate-400">Recharge</span>
                <span className="text-blue-400">{effects.recharge.toFixed(1)}s</span>
              </div>
            )}
            {effects.enduranceCost && (
              <div className="flex justify-between">
                <span className="text-slate-400">End Cost</span>
                <span className="text-cyan-400">{effects.enduranceCost.toFixed(2)}</span>
              </div>
            )}
            {effects.castTime && (
              <div className="flex justify-between">
                <span className="text-slate-400">Cast Time</span>
                <span className="text-slate-300">{effects.castTime.toFixed(2)}s</span>
              </div>
            )}
            {effects.range !== undefined && effects.range > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Range</span>
                <span className="text-slate-300">{effects.range} ft</span>
              </div>
            )}
            {effects.radius && (
              <div className="flex justify-between">
                <span className="text-slate-400">Radius</span>
                <span className="text-slate-300">{effects.radius} ft</span>
              </div>
            )}
            {effects.buffDuration && (
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="text-slate-300">{effects.buffDuration.toFixed(1)}s</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Damage */}
      {hasDamage && effects?.damage && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage
          </h4>
          <div className="space-y-0.5 text-xs">
            {'type' in effects.damage ? (
              <div className="flex justify-between">
                <span className="text-slate-400">{effects.damage.type}</span>
                <span className="text-red-400">{(effects.damage.scale ?? 0).toFixed(2)} scale</span>
              </div>
            ) : (
              effects.damage.types?.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-400">{d.type}</span>
                  <span className="text-red-400">{(d.scale ?? 0).toFixed(2)} scale</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DoT */}
      {effects?.dot && effects.dot.scale != null && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Damage Over Time
          </h4>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{effects.dot.type}</span>
              <span className="text-orange-400">{effects.dot.scale.toFixed(2)}/tick × {effects.dot.ticks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Healing */}
      {effects?.healing && effects.healing.scale != null && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Healing
          </h4>
          <div className="text-xs flex justify-between">
            <span className="text-slate-400">Heal Scale</span>
            <span className="text-green-400">{effects.healing.scale.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Mez Effects */}
      {hasMez && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Mez Effects
          </h4>
          <div className="space-y-0.5 text-xs">
            {effects?.stun && (
              <div className="flex justify-between">
                <span className="text-slate-400">Stun</span>
                <span className="text-purple-400">
                  Mag {effects.stun}{effects.stunDuration ? ` (${effects.stunDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.hold && (
              <div className="flex justify-between">
                <span className="text-slate-400">Hold</span>
                <span className="text-purple-400">
                  Mag {effects.hold}{effects.holdDuration ? ` (${effects.holdDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.immobilize && (
              <div className="flex justify-between">
                <span className="text-slate-400">Immobilize</span>
                <span className="text-purple-400">
                  Mag {effects.immobilize}{effects.immobilizeDuration ? ` (${effects.immobilizeDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.sleep && (
              <div className="flex justify-between">
                <span className="text-slate-400">Sleep</span>
                <span className="text-purple-400">
                  Mag {effects.sleep}{effects.sleepDuration ? ` (${effects.sleepDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.fear && (
              <div className="flex justify-between">
                <span className="text-slate-400">Fear</span>
                <span className="text-purple-400">
                  Mag {effects.fear}{effects.fearDuration ? ` (${effects.fearDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.confuse && (
              <div className="flex justify-between">
                <span className="text-slate-400">Confuse</span>
                <span className="text-purple-400">
                  Mag {effects.confuse}{effects.confuseDuration ? ` (${effects.confuseDuration.toFixed(1)}s)` : ''}
                </span>
              </div>
            )}
            {effects?.knockback && (
              <div className="flex justify-between">
                <span className="text-slate-400">Knockback</span>
                <span className="text-purple-400">
                  Mag {effects.knockback}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buffs - calculated using archetype modifier */}
      {hasBuffs && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Buffs
          </h4>
          <div className="space-y-0.5 text-xs">
            {effects?.tohitBuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">ToHit</span>
                <span className="text-green-400">
                  +{formatPercent(calculateBuffDebuffValue(effects.tohitBuff, effectiveMod))}
                </span>
              </div>
            )}
            {effects?.damageBuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">Damage</span>
                <span className="text-green-400">
                  +{formatPercent(calculateBuffDebuffValue(effects.damageBuff, effectiveMod))}
                </span>
              </div>
            )}
            {effects?.defenseBuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">Defense</span>
                <span className="text-green-400">
                  +{formatPercent(calculateBuffDebuffValue(effects.defenseBuff, effectiveMod))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debuffs - calculated using archetype modifier */}
      {hasDebuffs && (
        <div>
          <h4 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Debuffs
          </h4>
          <div className="space-y-0.5 text-xs">
            {effects?.tohitDebuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">ToHit</span>
                <span className="text-red-400">
                  -{formatPercent(calculateBuffDebuffValue(effects.tohitDebuff, effectiveMod))}
                </span>
              </div>
            )}
            {effects?.defenseDebuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">Defense</span>
                <span className="text-red-400">
                  -{formatPercent(calculateBuffDebuffValue(effects.defenseDebuff, effectiveMod))}
                </span>
              </div>
            )}
            {effects?.resistanceDebuff && (
              <div className="flex justify-between">
                <span className="text-slate-400">Resistance</span>
                <span className="text-red-400">
                  -{formatPercent(calculateBuffDebuffValue(effects.resistanceDebuff, effectiveMod))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defense (armor sets) */}
      {effects?.defense && (
        <DefenseResistanceDisplay
          label="Defense"
          values={effects.defense}
          colorClass="text-purple-400"
        />
      )}

      {/* Resistance (armor sets) */}
      {effects?.resistance && (
        <DefenseResistanceDisplay
          label="Resistance"
          values={effects.resistance}
          colorClass="text-orange-400"
        />
      )}

      {/* Mez Protection (armor sets) */}
      {effects?.protection && (
        <ProtectionDisplay protection={effects.protection} />
      )}
    </div>
  );
}

interface EnhancementInfoProps {
  enhancementId: string;
}

function EnhancementInfo({ enhancementId }: EnhancementInfoProps) {
  // TODO: Implement enhancement info display
  return (
    <div className="text-slate-500 text-xs">
      Enhancement: {enhancementId}
    </div>
  );
}
