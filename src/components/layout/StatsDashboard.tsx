/**
 * StatsDashboard component - displays key stats in a horizontal bar
 * Stats shown are configurable via the StatsConfigModal
 */

import { useMemo } from 'react';
import { useCalculatedStats } from '@/hooks';
import { useBuildStore, useUIStore } from '@/stores';
import { Tooltip } from '@/components/ui';
import { StatsConfigModal } from '@/components/modals';
import type { CalculatedStats } from '@/hooks/useCalculatedStats';

// ============================================
// STAT DEFINITIONS
// ============================================

interface StatDefinition {
  id: string;
  label: string;
  getValue: (stats: CalculatedStats, maxHP: number) => number | string;
  format: (value: number | string) => string;
  color: string;
  tooltip: string;
  showWhenZero?: boolean;
}

const STAT_DEFINITIONS: Record<string, StatDefinition> = {
  // Offense
  damage: {
    id: 'damage',
    label: 'Damage',
    getValue: (stats) => stats.globalDamage,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-red-400',
    tooltip: 'Global damage from set bonuses',
    showWhenZero: true,
  },
  accuracy: {
    id: 'accuracy',
    label: 'Accuracy',
    getValue: (stats) => stats.globalAccuracy,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-yellow-400',
    tooltip: 'Global accuracy from set bonuses',
    showWhenZero: true,
  },
  tohit: {
    id: 'tohit',
    label: 'ToHit',
    getValue: (stats) => stats.toHitBuff,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-yellow-300',
    tooltip: 'ToHit buff from set bonuses',
    showWhenZero: true,
  },
  recharge: {
    id: 'recharge',
    label: 'Recharge',
    getValue: (stats) => stats.globalRecharge,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-blue-400',
    tooltip: 'Global recharge from set bonuses',
    showWhenZero: true,
  },

  // Defense
  defense_melee: {
    id: 'defense_melee',
    label: 'Melee Def',
    getValue: (stats) => stats.defense.melee,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Melee defense',
    showWhenZero: true,
  },
  defense_ranged: {
    id: 'defense_ranged',
    label: 'Ranged Def',
    getValue: (stats) => stats.defense.ranged,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Ranged defense',
    showWhenZero: true,
  },
  defense_aoe: {
    id: 'defense_aoe',
    label: 'AoE Def',
    getValue: (stats) => stats.defense.aoe,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'AoE defense',
    showWhenZero: true,
  },
  defense_smashing: {
    id: 'defense_smashing',
    label: 'S/L Def',
    getValue: (stats) => Math.max(stats.defense.smashing, stats.defense.lethal),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Smashing/Lethal defense',
    showWhenZero: true,
  },
  defense_fire: {
    id: 'defense_fire',
    label: 'F/C Def',
    getValue: (stats) => Math.max(stats.defense.fire, stats.defense.cold),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Fire/Cold defense',
    showWhenZero: true,
  },
  defense_energy: {
    id: 'defense_energy',
    label: 'E/N Def',
    getValue: (stats) => Math.max(stats.defense.energy, stats.defense.negative),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Energy/Negative defense',
    showWhenZero: true,
  },
  defense_psionic: {
    id: 'defense_psionic',
    label: 'Psi Def',
    getValue: (stats) => stats.defense.psionic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Psionic defense',
    showWhenZero: true,
  },
  defense_toxic: {
    id: 'defense_toxic',
    label: 'Toxic Def',
    getValue: () => 0, // Toxic defense is rare
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-purple-400',
    tooltip: 'Toxic defense',
    showWhenZero: true,
  },

  // Resistance
  resist_smashing: {
    id: 'resist_smashing',
    label: 'S/L Res',
    getValue: (stats) => Math.max(stats.resistance.smashing, stats.resistance.lethal),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Smashing/Lethal resistance',
    showWhenZero: true,
  },
  resist_fire: {
    id: 'resist_fire',
    label: 'F/C Res',
    getValue: (stats) => Math.max(stats.resistance.fire, stats.resistance.cold),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Fire/Cold resistance',
    showWhenZero: true,
  },
  resist_energy: {
    id: 'resist_energy',
    label: 'E/N Res',
    getValue: (stats) => Math.max(stats.resistance.energy, stats.resistance.negative),
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Energy/Negative resistance',
    showWhenZero: true,
  },
  resist_psionic: {
    id: 'resist_psionic',
    label: 'Psi Res',
    getValue: (stats) => stats.resistance.psionic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Psionic resistance',
    showWhenZero: true,
  },
  resist_toxic: {
    id: 'resist_toxic',
    label: 'Toxic Res',
    getValue: (stats) => stats.resistance.toxic,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-400',
    tooltip: 'Toxic resistance',
    showWhenZero: true,
  },

  // Mez Resistance
  mez_hold: {
    id: 'mez_hold',
    label: 'Hold Res',
    getValue: (stats) => stats.mezResistance.hold,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Hold resistance',
  },
  mez_stun: {
    id: 'mez_stun',
    label: 'Stun Res',
    getValue: (stats) => stats.mezResistance.stun,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Stun resistance',
  },
  mez_immob: {
    id: 'mez_immob',
    label: 'Immob Res',
    getValue: (stats) => stats.mezResistance.immobilize,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Immobilize resistance',
  },
  mez_sleep: {
    id: 'mez_sleep',
    label: 'Sleep Res',
    getValue: (stats) => stats.mezResistance.sleep,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Sleep resistance',
  },
  mez_confuse: {
    id: 'mez_confuse',
    label: 'Confuse Res',
    getValue: (stats) => stats.mezResistance.confuse,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Confuse resistance',
  },
  mez_fear: {
    id: 'mez_fear',
    label: 'Fear Res',
    getValue: (stats) => stats.mezResistance.fear,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Fear resistance',
  },
  mez_kb: {
    id: 'mez_kb',
    label: 'KB Res',
    getValue: (stats) => stats.mezResistance.knockback,
    format: (v) => `${Number(v).toFixed(1)}%`,
    color: 'text-orange-300',
    tooltip: 'Knockback resistance',
  },

  // Endurance
  maxend: {
    id: 'maxend',
    label: 'Max End',
    getValue: (stats) => stats.maxEndurance,
    format: (v) => `${Number(v).toFixed(0)}`,
    color: 'text-blue-400',
    tooltip: 'Maximum endurance',
    showWhenZero: true,
  },
  recovery: {
    id: 'recovery',
    label: 'Recovery',
    getValue: (stats) => stats.recoveryBuff,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-blue-300',
    tooltip: 'Endurance recovery buff',
    showWhenZero: true,
  },
  endreduction: {
    id: 'endreduction',
    label: 'End Red',
    getValue: (stats) => stats.enduranceReduction,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-blue-300',
    tooltip: 'Endurance reduction',
  },

  // Health
  health: {
    id: 'health',
    label: 'HP',
    getValue: (stats, maxHP) => maxHP > 0 ? Math.floor(maxHP * (1 + stats.hpBuff / 100)) : 0,
    format: (v) => `${v}`,
    color: 'text-green-400',
    tooltip: 'Maximum hit points',
    showWhenZero: true,
  },
  regeneration: {
    id: 'regeneration',
    label: 'Regen',
    getValue: (stats) => stats.regenBuff,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-green-300',
    tooltip: 'Regeneration buff',
    showWhenZero: true,
  },

  // Movement
  runspeed: {
    id: 'runspeed',
    label: 'Run',
    getValue: (stats) => stats.runSpeed,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Run speed buff',
  },
  flyspeed: {
    id: 'flyspeed',
    label: 'Fly',
    getValue: (stats) => stats.flySpeed,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Fly speed buff',
  },
  jumpspeed: {
    id: 'jumpspeed',
    label: 'Jump Spd',
    getValue: (stats) => stats.jumpHeight, // Using jumpHeight for now
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump speed buff',
  },
  jumpheight: {
    id: 'jumpheight',
    label: 'Jump Ht',
    getValue: (stats) => stats.jumpHeight,
    format: (v) => `+${Number(v).toFixed(1)}%`,
    color: 'text-teal-400',
    tooltip: 'Jump height buff',
  },
};

export function StatsDashboard() {
  const stats = useCalculatedStats();
  const build = useBuildStore((s) => s.build);
  const statsConfig = useUIStore((s) => s.statsConfig);
  const statsConfigModalOpen = useUIStore((s) => s.statsConfigModalOpen);
  const openStatsConfigModal = useUIStore((s) => s.openStatsConfigModal);
  const closeStatsConfigModal = useUIStore((s) => s.closeStatsConfigModal);

  const maxHP = build.archetype?.stats?.maxHP || 0;

  // Calculate power and slot counts
  const currentPowerCount =
    build.primary.powers.length +
    build.secondary.powers.length +
    build.pools.reduce((sum, pool) => sum + pool.powers.length, 0) +
    (build.epicPool?.powers.length ?? 0);
  const currentSlotCount =
    build.primary.powers.reduce((sum, p) => sum + p.slots.length, 0) +
    build.secondary.powers.reduce((sum, p) => sum + p.slots.length, 0) +
    build.pools.reduce((sum, pool) => sum + pool.powers.reduce((s, p) => s + p.slots.length, 0), 0) +
    (build.epicPool?.powers.reduce((sum, p) => sum + p.slots.length, 0) ?? 0);

  // Get visible stats based on config
  const visibleStats = useMemo(() => {
    return statsConfig
      .filter((config) => config.visible && STAT_DEFINITIONS[config.stat])
      .sort((a, b) => a.order - b.order)
      .map((config) => {
        const def = STAT_DEFINITIONS[config.stat];
        const value = def.getValue(stats, maxHP);
        return { ...def, value };
      })
      .filter((stat) => stat.showWhenZero || Number(stat.value) !== 0);
  }, [statsConfig, stats, maxHP]);

  // Stat categories for grouping (should match config modal)
  const STAT_CATEGORIES = [
    {
      name: 'Offense',
      stats: ['damage', 'accuracy', 'tohit', 'recharge'],
      panelClass: 'h-[80px] min-h-[80px] max-h-[100px] overflow-hidden',
    },
    {
      name: 'Health & Endurance',
      stats: ['health', 'regeneration', 'maxend', 'recovery'],
      panelClass: 'h-[80px] min-h-[80px] max-h-[100px] overflow-hidden',
    },
    {
      name: 'Defense',
      stats: [
        'defense_melee',
        'defense_ranged',
        'defense_aoe',
        'defense_smashing',
        'defense_fire',
        'defense_energy',
        'defense_psionic',
        'defense_toxic',
      ],
      panelClass: 'h-[168px] min-h-[168px] max-h-[168px] overflow-hidden',
    },
    {
      name: 'Resistance & Mez',
      stats: [
        'resist_smashing',
        'resist_fire',
        'resist_energy',
        'resist_psionic',
        'resist_toxic',
        'mez_hold',
        'mez_stun',
        'mez_immob',
        'mez_sleep',
        'mez_confuse',
        'mez_fear',
        'mez_kb',
      ],
      panelClass: 'h-[168px] min-h-[168px] max-h-[168px] overflow-hidden',
    },
    {
      name: 'Endurance',
      stats: ['endreduction'],
      panelClass: '',
    },
    {
      name: 'Movement',
      stats: ['runspeed', 'flyspeed', 'jumpspeed', 'jumpheight'],
      panelClass: '',
    },
  ];

  // Group visible stats by category
  const groupedStats = STAT_CATEGORIES.map((cat) => ({
    name: cat.name,
    stats: visibleStats.filter((s) => cat.stats.includes(s.id)),
    panelClass: cat.panelClass || '',
  })).filter((cat) => cat.stats.length > 0);

  return (
    <>
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Grouped stats - all panels in a single flex container with consistent gap */}
          <div className="flex-1 flex flex-wrap gap-4 items-start">
            {/* Resources panel - Powers and Slots remaining */}
            <div className="flex flex-col gap-2 min-w-[140px] max-w-[160px]">
              <div className="bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 h-[168px] min-h-[168px] max-h-[168px]">
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Resources</div>
                <div className="flex flex-col gap-3">
                  <Tooltip content={`${24 - currentPowerCount} power picks remaining (${currentPowerCount} used)`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Powers</span>
                      <span
                        className={`text-sm font-medium ${
                          currentPowerCount > 24 ? 'text-red-400' : 24 - currentPowerCount <= 3 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}
                      >
                        {24 - currentPowerCount}/24
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip content={`${67 - currentSlotCount} enhancement slots remaining (${currentSlotCount} used)`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Slots</span>
                      <span
                        className={`text-sm font-medium ${
                          currentSlotCount > 67 ? 'text-red-400' : 67 - currentSlotCount <= 5 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}
                      >
                        {67 - currentSlotCount}/67
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Offense and Health & Endurance stacked vertically */}
            <div className="flex flex-col gap-2 min-w-[300px] max-w-[360px]">
              {groupedStats.find((g) => g.name === 'Offense') && (
                <div
                  className={`bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${groupedStats.find((g) => g.name === 'Offense')?.panelClass}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Offense</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {groupedStats.find((g) => g.name === 'Offense')?.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                      />
                    ))}
                  </div>
                </div>
              )}
              {groupedStats.find((g) => g.name === 'Health & Endurance') && (
                <div
                  className={`bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${groupedStats.find((g) => g.name === 'Health & Endurance')?.panelClass}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Health & Endurance</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {groupedStats.find((g) => g.name === 'Health & Endurance')?.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* The rest of the panels */}
            {groupedStats
              .filter((g) => g.name !== 'Offense' && g.name !== 'Health & Endurance')
              .map((group) => (
                <div
                  key={group.name}
                  className={`min-w-[300px] max-w-[360px] bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 ${group.panelClass}`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">{group.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {group.stats.map((stat) => (
                      <StatItem
                        key={stat.id}
                        label={stat.label}
                        value={stat.format(stat.value)}
                        color={stat.color}
                        tooltip={stat.tooltip}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Dashboard actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={openStatsConfigModal}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors"
              title="Configure dashboard stats"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Config Modal */}
      <StatsConfigModal
        isOpen={statsConfigModalOpen}
        onClose={closeStatsConfigModal}
      />
    </>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  color?: string;
  tooltip?: string;
  className?: string;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, className = '' }: StatItemProps) {
  const content = (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
}
