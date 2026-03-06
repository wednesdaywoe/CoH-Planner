/**
 * DetailedTotalsModal — comprehensive character stat sheet showing every stat
 * with expandable source breakdowns.
 */

import { useState, useMemo } from 'react';
import { Modal, ModalBody } from './Modal';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { useBuildStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatValue, MezStatValue } from '@/data/stat-definitions';
import type { DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';

// Expanded categories for detailed view (individual types, not paired)
const DETAILED_CATEGORIES = [
  {
    name: 'Offense',
    stats: ['damage', 'accuracy', 'tohit', 'recharge', 'endreduction', 'range_bonus', 'heal_other', 'threat_level'],
  },
  {
    name: 'Health & Endurance',
    stats: ['health', 'regeneration', 'maxend', 'recovery', 'level_shift'],
  },
  {
    name: 'Movement',
    stats: ['runspeed', 'flyspeed', 'jumpspeed', 'jumpheight'],
  },
  {
    name: 'Stealth & Perception',
    stats: ['stealth_pve', 'stealth_pvp', 'perception_bonus'],
  },
  {
    name: 'Defense',
    stats: [
      'defense_melee', 'defense_ranged', 'defense_aoe',
      'def_smashing', 'def_lethal', 'def_fire', 'def_cold',
      'def_energy', 'def_negative', 'def_psionic', 'def_toxic',
    ],
  },
  {
    name: 'Damage Resistance',
    stats: [
      'res_smashing', 'res_lethal', 'res_fire', 'res_cold',
      'res_energy', 'res_negative', 'res_psionic', 'res_toxic',
    ],
  },
  {
    name: 'Status Protection',
    stats: [
      'prot_hold', 'prot_stun', 'prot_immob', 'prot_sleep',
      'prot_confuse', 'prot_fear', 'prot_kb',
      'prot_repel', 'prot_teleport',
    ],
  },
  {
    name: 'Status Resistance',
    stats: [
      'mezres_hold', 'mezres_stun', 'mezres_immob', 'mezres_sleep',
      'mezres_confuse', 'mezres_fear', 'mezres_kb',
      'mezres_taunt', 'mezres_placate',
    ],
  },
  {
    name: 'Debuff Resistance',
    stats: [
      'debuff_slow', 'debuff_defense', 'debuff_recharge',
      'debuff_endurance', 'debuff_recovery', 'debuff_tohit',
      'debuff_regen', 'debuff_perception',
    ],
  },
];

// Stats that need globalBonuses values instead of CalculatedStats
const GLOBAL_BONUS_OVERRIDES: Record<string, keyof GlobalBonuses> = {
  range_bonus: 'range',
  heal_other: 'healOther',
  threat_level: 'threatLevel',
  stealth_pve: 'stealthRadiusPvE',
  stealth_pvp: 'stealthRadiusPvP',
  perception_bonus: 'perceptionRadius',
  prot_repel: 'protRepel',
  prot_teleport: 'protTeleport',
  mezres_taunt: 'mezResistTaunt',
  mezres_placate: 'mezResistPlacate',
  level_shift: 'levelShift',
};

interface DetailedTotalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedTotalsModal({ isOpen, onClose }: DetailedTotalsModalProps) {
  const stats = useCalculatedStats();
  const calcResult = useCharacterCalculation();
  const build = useBuildStore((s) => s.build);
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const health = getBaselineHealth(build.archetype?.id ?? undefined, build.level);
  const baseHP = health.baseHealth;
  const maxHPCap = health.maxHealth;
  const breakdowns = calcResult.breakdown;
  const globalBonuses = calcResult.globalBonuses;

  // Compute all stats with their values and breakdowns
  const allStats = useMemo(() => {
    return DETAILED_CATEGORIES.map((cat) => ({
      name: cat.name,
      stats: cat.stats
        .map((id) => {
          const def = STAT_DEFINITIONS[id];
          if (!def) return null;

          // Override getValue for stats that need globalBonuses
          const globalKey = GLOBAL_BONUS_OVERRIDES[id];
          const value = globalKey
            ? globalBonuses[globalKey]
            : def.getValue(stats, baseHP, maxHPCap);

          const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;
          return { ...def, value, breakdown };
        })
        .filter(Boolean) as Array<{
          id: string;
          label: string;
          value: StatValue;
          format: (v: StatValue) => string;
          color: string;
          tooltip: string;
          breakdown?: DashboardStatBreakdown;
          breakdownKey?: string;
          breakdownUnit?: string;
        }>,
    }));
  }, [stats, baseHP, maxHPCap, breakdowns, globalBonuses]);

  const isNonZero = (v: StatValue): boolean => {
    if (typeof v === 'object' && v !== null && 'protection' in v) {
      const mez = v as MezStatValue;
      return mez.protection !== 0 || mez.resistance !== 0;
    }
    if (typeof v === 'object' && v !== null && 'perSec' in v) {
      return true; // Recovery/regen always show
    }
    if (typeof v === 'object' && v !== null && 'first' in v) {
      return (v as { first: number; second: number }).first !== 0 || (v as { first: number; second: number }).second !== 0;
    }
    return Number(v) !== 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detailed Totals" size="full">
      <ModalBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[80vh] overflow-y-auto pr-1">
          {allStats.map((cat) => (
            <div
              key={cat.name}
              className="bg-slate-800/70 rounded-lg border border-slate-700 p-3"
            >
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {cat.name}
              </div>
              <div className="space-y-0.5">
                {cat.stats.map((stat) => {
                  const hasValue = isNonZero(stat.value);
                  const isExpanded = expandedStat === stat.id;
                  const hasSources = stat.breakdown && stat.breakdown.sources.length > 0;

                  return (
                    <div key={stat.id}>
                      <div
                        className={`flex items-baseline justify-between gap-2 py-0.5 px-1 rounded ${
                          hasSources ? 'cursor-pointer hover:bg-slate-700/50' : ''
                        } ${isExpanded ? 'bg-slate-700/50' : ''}`}
                        onClick={() => {
                          if (hasSources) {
                            setExpandedStat(isExpanded ? null : stat.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {hasSources && (
                            <span className="text-[9px] text-slate-500 flex-shrink-0">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">{stat.label}</span>
                        </div>
                        <span
                          className={`text-sm font-medium tabular-nums text-right flex-shrink-0 ${
                            hasValue ? stat.color : 'text-slate-600'
                          }`}
                        >
                          {stat.format(stat.value)}
                        </span>
                      </div>

                      {/* Expanded breakdown */}
                      {isExpanded && stat.breakdown && (
                        <BreakdownPanel
                          breakdown={stat.breakdown}
                          unit={stat.breakdownUnit ?? '%'}
                          color={stat.color}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}

// Source type labels and colors
const SOURCE_GROUPS: Array<{
  type: string;
  label: string;
  color: string;
}> = [
  { type: 'set-bonus', label: 'Set Bonuses', color: 'text-green-400' },
  { type: 'active-power', label: 'Active Powers', color: 'text-amber-400' },
  { type: 'inherent', label: 'Inherent Powers', color: 'text-blue-400' },
  { type: 'accolade', label: 'Accolades', color: 'text-amber-300' },
  { type: 'proc', label: 'Procs', color: 'text-cyan-400' },
  { type: 'incarnate', label: 'Incarnate Powers', color: 'text-purple-400' },
];

function BreakdownPanel({
  breakdown,
  unit,
  color,
}: {
  breakdown: DashboardStatBreakdown;
  unit: string;
  color: string;
}) {
  return (
    <div className="ml-4 mr-1 mb-1 mt-0.5 pl-2 border-l border-slate-600/50 space-y-1.5">
      {SOURCE_GROUPS.map(({ type, label, color: srcColor }) => {
        const sources = breakdown.sources.filter((s) => s.type === type);
        if (sources.length === 0) return null;
        return (
          <div key={type}>
            <div className="text-[9px] text-slate-500 uppercase mb-0.5">{label}</div>
            {sources.map((source, i) => (
              <div
                key={i}
                className={`flex justify-between text-[10px] ${source.capped ? 'opacity-70' : ''}`}
              >
                <span
                  className={`${
                    source.capped ? 'text-orange-400 line-through' : 'text-slate-300'
                  } truncate max-w-[200px]`}
                >
                  {source.name}
                </span>
                <span
                  className={`ml-2 flex-shrink-0 ${
                    source.capped ? 'text-orange-400 line-through' : srcColor
                  }`}
                >
                  +{source.value.toFixed(2)}{unit}
                </span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Total */}
      <div className="border-t border-slate-600/50 pt-0.5 flex justify-between text-[11px] font-medium">
        <span className="text-slate-300">Total</span>
        <span className={color}>+{breakdown.total.toFixed(2)}{unit}</span>
      </div>
    </div>
  );
}
