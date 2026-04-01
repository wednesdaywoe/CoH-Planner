/**
 * DetailedTotalsModal — comprehensive character stat sheet showing every stat
 * with expandable source breakdowns. Supports tabs for comparing loaded builds.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Modal, ModalBody } from './Modal';
import { useCalculatedStats, useCharacterCalculation } from '@/hooks';
import { convertToLegacyStats } from '@/hooks/useCalculatedStats';
import { useBuildStore, useAuthStore } from '@/stores';
import { getBaselineHealth } from '@/utils/calculations/stats';
import { getArchetype } from '@/data/archetypes';
import type { ArchetypeId } from '@/types';
import { calculateCharacterTotals } from '@/utils/calculations/character-totals';
import { hydrateBuild } from '@/utils/build-serialization';
import { getMyBuilds, getOwnedBuildIds, isShareEnabled } from '@/services/sharedBuilds';
import { STAT_DEFINITIONS } from '@/data/stat-definitions';
import type { StatValue, MezStatValue } from '@/data/stat-definitions';
import type { CalculatedStats, DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses, CharacterCalculationResult } from '@/utils/calculations/character-totals';
import type { Build } from '@/types/build';
import type { SharedBuild } from '@/types/shared';

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
  /** Cap value as a percentage (e.g. 90 for 90%). Present for defense/resistance stats. */
  cap?: number;
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
  archetypeId?: string,
) {
  const at = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const defenseCap = (at?.stats.defenseCap ?? 0.45) * 100;
  const resistanceCap = (at?.stats.resistanceCap ?? 0.75) * 100;

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

        // Attach cap for defense/resistance stats
        let cap: number | undefined;
        if (id.startsWith('def_') || id.startsWith('defense_')) cap = defenseCap;
        else if (id.startsWith('res_')) cap = resistanceCap;

        return { ...def, value, breakdown, cap } as StatRow;
      })
      .filter(Boolean) as StatRow[],
  }));
}

function parseBuildFromJSON(json: string): Build | null {
  try {
    const data = JSON.parse(json);
    if (!data.build) return null;

    // v2/v3 slim format — hydrate back to full Build
    if (data.version >= 2) {
      return hydrateBuild(data.build);
    }

    // v1 legacy format — convert pieces arrays back to Sets
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

/** Parse a SharedBuild (from vault/library) into a full Build */
function parseSharedBuild(shared: SharedBuild): Build | null {
  try {
    const data = shared.build_json;
    if (!data?.build) return null;
    if ((data as { version?: number }).version && (data as { version: number }).version >= 2) {
      return hydrateBuild(data.build as Record<string, any>);
    }
    // v1 fallback
    const setsEntries = Object.entries((data.build as any).sets || {}) as [
      string,
      { count: number; pieces: number[] },
    ][];
    return {
      ...(data.build as any),
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

/** Convert a parsed Build into a LoadedBuild with calculated stats */
function buildToLoadedBuild(parsedBuild: Build, name: string): LoadedBuild {
  const result = calculateCharacterTotals(parsedBuild, false);
  const legacy = convertToLegacyStats(result.stats, result);
  const h = getBaselineHealth(parsedBuild.archetype?.id ?? undefined, parsedBuild.level);
  return {
    name,
    build: parsedBuild,
    calcResult: result,
    legacyStats: legacy,
    baseHP: h.baseHealth,
    maxHPCap: h.maxHealth,
  };
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

/** Bar meter showing value relative to AT cap, with overflow in a separate color */
function CapMeter({ value, cap }: { value: number; cap: number }) {
  // Max display range: slightly beyond cap to show overflow context
  const maxDisplay = cap * 1.3;
  const capped = Math.min(value, cap);
  const overflow = Math.max(0, value - cap);
  const cappedPct = (capped / maxDisplay) * 100;
  const overflowPct = (overflow / maxDisplay) * 100;
  const isCapped = value >= cap;

  return (
    <div className="flex items-center gap-1.5 mt-0.5 px-1">
      <div className="flex-1 h-[6px] bg-slate-700/80 rounded-full overflow-hidden relative">
        {/* Capped portion */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${isCapped ? 'bg-emerald-500' : 'bg-emerald-500/70'}`}
          style={{ width: `${cappedPct}%` }}
        />
        {/* Overflow portion */}
        {overflow > 0 && (
          <div
            className="absolute inset-y-0 rounded-full bg-amber-500/70"
            style={{ left: `${cappedPct}%`, width: `${overflowPct}%` }}
          />
        )}
        {/* Cap marker line */}
        <div
          className="absolute inset-y-0 w-px bg-slate-300/50"
          style={{ left: `${(cap / maxDisplay) * 100}%` }}
        />
      </div>
      <span className="text-[9px] text-slate-500 tabular-nums flex-shrink-0 w-8 text-right">
        {cap}%
      </span>
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

                  {/* Cap meter for defense/resistance */}
                  {stat.cap != null && typeof stat.value === 'number' && (
                    <CapMeter value={stat.value} cap={stat.cap} />
                  )}

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
    () => computeAllStats(stats, globalBonuses, breakdowns, baseHP, maxHPCap, build.archetype?.id ?? undefined),
    [stats, globalBonuses, breakdowns, baseHP, maxHPCap, build.archetype?.id],
  );

  // Compute stats for loaded builds
  const loadedBuildStats = useMemo(
    () =>
      loadedBuilds.map((lb) =>
        computeAllStats(lb.legacyStats, lb.calcResult.globalBonuses, lb.calcResult.breakdown, lb.baseHP, lb.maxHPCap, lb.build.archetype?.id ?? undefined),
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

      const buildName = parsedBuild.name || file.name.replace(/\.(json|skif)$/, '');
      const loaded = buildToLoadedBuild(parsedBuild, buildName);

      setLoadedBuilds((prev) => {
        const next = [...prev, loaded];
        setActiveTab(next.length);
        return next;
      });
    };
    reader.readAsText(file);

    // Reset input so same file can be loaded again
    e.target.value = '';
  }, []);

  // Vault builds state
  const user = useAuthStore((s) => s.user);
  const [showVaultPicker, setShowVaultPicker] = useState(false);
  const [vaultBuilds, setVaultBuilds] = useState<SharedBuild[] | null>(null);
  const [vaultLoading, setVaultLoading] = useState(false);

  const handleOpenVaultPicker = useCallback(async () => {
    if (vaultBuilds !== null) {
      // Already loaded, just toggle visibility
      setShowVaultPicker((prev) => !prev);
      return;
    }
    setVaultLoading(true);
    setShowVaultPicker(true);
    try {
      let builds: SharedBuild[];
      if (user) {
        // Logged in — fetch from Supabase
        builds = await getMyBuilds();
      } else {
        // Not logged in — check for locally-owned builds
        const ownedIds = getOwnedBuildIds();
        if (ownedIds.length === 0) {
          builds = [];
        } else {
          // Fetch owned builds from Supabase by ID
          const { searchSharedBuilds } = await import('@/services/sharedBuilds');
          const result = await searchSharedBuilds({ pageSize: 100 });
          builds = result.builds.filter((b) => ownedIds.includes(b.id));
        }
      }
      setVaultBuilds(builds);
    } catch {
      setVaultBuilds([]);
    } finally {
      setVaultLoading(false);
    }
  }, [vaultBuilds, user]);

  const handleLoadVaultBuild = useCallback((shared: SharedBuild) => {
    setLoadError(null);
    const parsedBuild = parseSharedBuild(shared);
    if (!parsedBuild) {
      setLoadError('Could not parse vault build');
      return;
    }

    const loaded = buildToLoadedBuild(parsedBuild, shared.name);
    setLoadedBuilds((prev) => {
      const next = [...prev, loaded];
      setActiveTab(next.length);
      return next;
    });
    setShowVaultPicker(false);
  }, []);

  // Reset vault state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowVaultPicker(false);
      setVaultBuilds(null);
    }
  }, [isOpen]);

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
            className={`px-3 py-1.5 text-xs rounded-t font-medium transition-colors max-w-[180px] truncate ${
              activeTab === 0
                ? 'bg-slate-700 text-emerald-400 border border-slate-600 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={build.name || 'Current Build'}
          >
            {build.name || 'Current Build'}
          </button>

          {/* Loaded build tabs */}
          {loadedBuilds.map((lb, i) => (
            <div key={i} className="flex items-center max-w-[200px]">
              <button
                onClick={() => setActiveTab(i + 1)}
                className={`px-3 py-1.5 text-xs rounded-t font-medium transition-colors truncate min-w-0 ${
                  activeTab === i + 1
                    ? 'bg-slate-700 text-amber-400 border border-slate-600 border-b-transparent'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={lb.name}
              >
                {lb.name}
              </button>
              <button
                onClick={() => handleRemoveTab(i)}
                className="text-slate-500 hover:text-red-400 text-xs px-1 flex-shrink-0"
                title="Remove this build"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Load build buttons */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1.5 text-xs text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
            title="Load a build file to compare"
          >
            + From File
          </button>
          {isShareEnabled() && (
            <button
              onClick={handleOpenVaultPicker}
              className={`px-2 py-1.5 text-xs rounded transition-colors ${
                showVaultPicker
                  ? 'text-purple-400 bg-slate-800'
                  : 'text-slate-500 hover:text-purple-400 hover:bg-slate-800'
              }`}
              title={user ? 'Load a build from your vault' : 'Load a build you own'}
            >
              + From Vault
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".skif,.json"
            onChange={handleFileLoad}
            className="hidden"
          />
        </div>

        {/* Vault build picker */}
        {showVaultPicker && (
          <div className="mb-3 border border-slate-700 rounded-lg bg-slate-800/50 max-h-48 overflow-y-auto">
            {vaultLoading ? (
              <div className="p-3 text-xs text-slate-400 text-center">Loading vault builds...</div>
            ) : !vaultBuilds || vaultBuilds.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 text-center">
                {user ? 'No builds in your vault' : 'No owned builds found. Share a build to add it to your vault.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {vaultBuilds.map((vb) => (
                  <button
                    key={vb.id}
                    onClick={() => handleLoadVaultBuild(vb)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">{vb.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {vb.archetype_name} — {vb.primary_name} / {vb.secondary_name} — Lv{vb.level}
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-400 flex-shrink-0">Load</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {loadError && (
          <div className="text-xs text-red-400 mb-2">{loadError}</div>
        )}

        {/* Active build info */}
        <div className="text-xs text-slate-500 mb-2">
          {activeTab === 0
            ? `${build.archetype?.name ?? 'Unknown'} — Level ${build.level}`
            : loadedBuilds[activeTab - 1]
              ? `${loadedBuilds[activeTab - 1].build.archetype?.name ?? 'Unknown'} — Level ${loadedBuilds[activeTab - 1].build.level}`
              : ''}
        </div>

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
