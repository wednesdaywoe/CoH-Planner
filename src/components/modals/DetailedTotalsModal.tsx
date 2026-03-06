/**
 * DetailedTotalsModal — comprehensive character stat sheet showing every stat
 * with expandable source breakdowns. Supports tabs for comparing loaded builds.
 */

import { useState, useMemo, useCallback, useRef } from 'react';
import { Modal, ModalBody } from './Modal';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { convertToLegacyStats } from '@/hooks/useCalculatedStats';
import { useBuildStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatValue, MezStatValue } from '@/data/stat-definitions';
import type { CalculatedStats, DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses, CharacterCalculationResult } from '@/utils/calculations/character-totals';
import type { Build } from '@/types/build';

// ============================================
// CONSTANTS
// ============================================

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

// ============================================
// TYPES
// ============================================

interface LoadedBuild {
  name: string;
  build: Build;
  calcResult: CharacterCalculationResult;
  legacyStats: CalculatedStats;
  baseHP: number;
  maxHPCap: number;
}

interface StatRow {
  id: string;
  label: string;
  value: StatValue;
  format: (v: StatValue) => string;
  color: string;
  tooltip: string;
  breakdown?: DashboardStatBreakdown;
  breakdownKey?: string;
  breakdownUnit?: string;
}

// ============================================
// HELPERS
// ============================================

function computeAllStats(
  stats: CalculatedStats,
  globalBonuses: GlobalBonuses,
  breakdowns: Map<string, DashboardStatBreakdown>,
  baseHP: number,
  maxHPCap: number,
) {
  return DETAILED_CATEGORIES.map((cat) => ({
    name: cat.name,
    stats: cat.stats
      .map((id) => {
        const def = STAT_DEFINITIONS[id];
        if (!def) return null;

        const globalKey = GLOBAL_BONUS_OVERRIDES[id];
        const value = globalKey
          ? globalBonuses[globalKey]
          : def.getValue(stats, baseHP, maxHPCap);

        const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;
        return { ...def, value, breakdown } as StatRow;
      })
      .filter(Boolean) as StatRow[],
  }));
}

function parseBuildFromJSON(json: string): Build | null {
  try {
    const data = JSON.parse(json);
    if (!data.build) return null;

    // Convert pieces arrays back to Sets (same logic as buildStore.importBuild)
    const setsEntries = Object.entries(data.build.sets || {}) as [
      string,
      { count: number; pieces: number[] },
    ][];
    return {
      ...data.build,
      sets: Object.fromEntries(
        setsEntries.map(([setId, tracking]) => [
          setId,
          { count: tracking.count, pieces: new Set(tracking.pieces) },
        ]),
      ),
    } as Build;
  } catch {
    return null;
  }
}

function isNonZero(v: StatValue): boolean {
  if (typeof v === 'object' && v !== null && 'protection' in v) {
    const mez = v as MezStatValue;
    return mez.protection !== 0 || mez.resistance !== 0;
  }
  if (typeof v === 'object' && v !== null && 'perSec' in v) {
    return true;
  }
  if (typeof v === 'object' && v !== null && 'first' in v) {
    return (v as { first: number; second: number }).first !== 0 || (v as { first: number; second: number }).second !== 0;
  }
  return Number(v) !== 0;
}

// ============================================
// SUBCOMPONENTS
// ============================================

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

function StatGrid({
  allStats,
}: {
  allStats: Array<{ name: string; stats: StatRow[] }>;
}) {
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto pr-1">
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
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface DetailedTotalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedTotalsModal({ isOpen, onClose }: DetailedTotalsModalProps) {
  const stats = useCalculatedStats();
  const calcResult = useCharacterCalculation();
  const build = useBuildStore((s) => s.build);

  const health = getBaselineHealth(build.archetype?.id ?? undefined, build.level);
  const baseHP = health.baseHealth;
  const maxHPCap = health.maxHealth;
  const breakdowns = calcResult.breakdown;
  const globalBonuses = calcResult.globalBonuses;

  // Tab state
  const [activeTab, setActiveTab] = useState(0); // 0 = current build
  const [loadedBuilds, setLoadedBuilds] = useState<LoadedBuild[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute stats for current build
  const currentBuildStats = useMemo(
    () => computeAllStats(stats, globalBonuses, breakdowns, baseHP, maxHPCap),
    [stats, globalBonuses, breakdowns, baseHP, maxHPCap],
  );

  // Compute stats for loaded builds
  const loadedBuildStats = useMemo(
    () =>
      loadedBuilds.map((lb) =>
        computeAllStats(lb.legacyStats, lb.calcResult.globalBonuses, lb.calcResult.breakdown, lb.baseHP, lb.maxHPCap),
      ),
    [loadedBuilds],
  );

  // Handle file load
  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const parsedBuild = parseBuildFromJSON(content);
      if (!parsedBuild) {
        setLoadError('Invalid build file format');
        return;
      }

      const result = calculateCharacterTotals(parsedBuild, false);
      const legacy = convertToLegacyStats(result.stats, result);
      const h = getBaselineHealth(parsedBuild.archetype?.id ?? undefined, parsedBuild.level);

      const buildName = parsedBuild.name || file.name.replace(/\.json$/, '');

      setLoadedBuilds((prev) => {
        const next = [
          ...prev,
          {
            name: buildName,
            build: parsedBuild,
            calcResult: result,
            legacyStats: legacy,
            baseHP: h.baseHealth,
            maxHPCap: h.maxHealth,
          },
        ];
        // Switch to the new tab (1-indexed, 0 is current build)
        setActiveTab(next.length);
        return next;
      });
    };
    reader.readAsText(file);

    // Reset input so same file can be loaded again
    e.target.value = '';
  }, []);

  const handleRemoveTab = useCallback(
    (index: number) => {
      setLoadedBuilds((prev) => prev.filter((_, i) => i !== index));
      // If we're removing the active tab, go back to current build
      if (activeTab === index + 1) {
        setActiveTab(0);
      } else if (activeTab > index + 1) {
        setActiveTab((prev) => prev - 1);
      }
    },
    [activeTab],
  );

  // Get the active tab's stats
  const activeStats = activeTab === 0 ? currentBuildStats : loadedBuildStats[activeTab - 1];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detailed Totals" size="full">
      <ModalBody>
        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-3 border-b border-slate-700 pb-2 flex-wrap">
          {/* Current build tab */}
          <button
            onClick={() => setActiveTab(0)}
            className={`px-3 py-1.5 text-xs rounded-t font-medium transition-colors ${
              activeTab === 0
                ? 'bg-slate-700 text-emerald-400 border border-slate-600 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {build.name || 'Current Build'}
          </button>

          {/* Loaded build tabs */}
          {loadedBuilds.map((lb, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => setActiveTab(i + 1)}
                className={`px-3 py-1.5 text-xs rounded-t font-medium transition-colors ${
                  activeTab === i + 1
                    ? 'bg-slate-700 text-amber-400 border border-slate-600 border-b-transparent'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lb.name}
              </button>
              <button
                onClick={() => handleRemoveTab(i)}
                className="text-slate-500 hover:text-red-400 text-xs px-1 -ml-0.5"
                title="Remove this build"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Load build button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1.5 text-xs text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
            title="Load a build JSON file to compare"
          >
            + Load Build
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileLoad}
            className="hidden"
          />
        </div>

        {loadError && (
          <div className="text-xs text-red-400 mb-2">{loadError}</div>
        )}

        {/* Active build header */}
        {activeTab > 0 && loadedBuilds[activeTab - 1] && (
          <div className="text-xs text-slate-500 mb-2">
            {loadedBuilds[activeTab - 1].build.archetype?.name ?? 'Unknown'} —{' '}
            Level {loadedBuilds[activeTab - 1].build.level}
          </div>
        )}

        {/* Stat grid for the active tab */}
        {activeStats ? (
          <StatGrid allStats={activeStats} />
        ) : (
          <div className="text-center text-slate-500 py-8">
            Build data not available
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
