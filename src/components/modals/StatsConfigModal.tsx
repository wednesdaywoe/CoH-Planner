/**
 * StatsConfigModal - Configure which stats to display on the dashboard
 * Mirrors the legacy stats selector functionality
 */

import { useState } from 'react';
import { useUIStore } from '@/stores';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button, Toggle } from '@/components/ui';
import type { StatDisplayConfig } from '@/types';

// Color schemes for each category (matching legacy app)
const CATEGORY_COLORS = {
  // Damage stats - red
  damage: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-400',
    headerBg: 'bg-red-900/40',
    toggleOn: 'bg-red-500 border-red-500',
    toggleOff: 'border-red-400/50',
  },
  // Accuracy/ToHit - yellow
  accuracy: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    headerBg: 'bg-yellow-900/40',
    toggleOn: 'bg-yellow-500 border-yellow-500',
    toggleOff: 'border-yellow-400/50',
  },
  // Recharge - gray
  recharge: {
    bg: 'bg-slate-500',
    border: 'border-slate-400',
    text: 'text-slate-300',
    headerBg: 'bg-slate-800/60',
    toggleOn: 'bg-slate-500 border-slate-400',
    toggleOff: 'border-slate-400/50',
  },
  // Defense - purple
  defense: {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-400',
    headerBg: 'bg-purple-900/40',
    toggleOn: 'bg-purple-500 border-purple-500',
    toggleOff: 'border-purple-400/50',
  },
  // Resistance - orange
  resistance: {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-400',
    headerBg: 'bg-orange-900/40',
    toggleOn: 'bg-orange-500 border-orange-500',
    toggleOff: 'border-orange-400/50',
  },
  // Endurance/Recovery - blue
  endurance: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-400',
    headerBg: 'bg-blue-900/40',
    toggleOn: 'bg-blue-500 border-blue-500',
    toggleOff: 'border-blue-400/50',
  },
  // HP/Regen - green
  health: {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-400',
    headerBg: 'bg-green-900/40',
    toggleOn: 'bg-green-500 border-green-500',
    toggleOff: 'border-green-400/50',
  },
  // Movement - pale cool green (teal/cyan)
  movement: {
    bg: 'bg-teal-500',
    border: 'border-teal-400',
    text: 'text-teal-400',
    headerBg: 'bg-teal-900/40',
    toggleOn: 'bg-teal-500 border-teal-400',
    toggleOff: 'border-teal-400/50',
  },
  // Debuff Resistance - cyan
  debuffResist: {
    bg: 'bg-cyan-500',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    headerBg: 'bg-cyan-900/40',
    toggleOn: 'bg-cyan-500 border-cyan-400',
    toggleOff: 'border-cyan-400/50',
  },
};

type CategoryColorKey = keyof typeof CATEGORY_COLORS;

// Stat categories matching legacy app with color coding
const STAT_CATEGORIES: {
  name: string;
  colorKey: CategoryColorKey;
  stats: { stat: string; label: string; colorOverride?: CategoryColorKey }[];
}[] = [
  {
    name: 'Offense',
    colorKey: 'damage', // Default for the category header
    stats: [
      { stat: 'damage', label: 'Damage', colorOverride: 'damage' },
      { stat: 'accuracy', label: 'Accuracy', colorOverride: 'accuracy' },
      { stat: 'tohit', label: 'To-Hit', colorOverride: 'accuracy' },
      { stat: 'recharge', label: 'Recharge', colorOverride: 'recharge' },
    ],
  },
  {
    name: 'Defense',
    colorKey: 'defense',
    stats: [
      { stat: 'defense_melee', label: 'Melee Def' },
      { stat: 'defense_ranged', label: 'Ranged Def' },
      { stat: 'defense_aoe', label: 'AoE Def' },
      { stat: 'defense_smashing', label: 'S/L Def' },
      { stat: 'defense_fire', label: 'F/C Def' },
      { stat: 'defense_energy', label: 'E/N Def' },
      { stat: 'defense_psionic', label: 'Psi Def' },
      { stat: 'defense_toxic', label: 'Toxic Def' },
    ],
  },
  {
    name: 'Resistance & Mez',
    colorKey: 'resistance',
    stats: [
      { stat: 'resist_smashing', label: 'S/L Res' },
      { stat: 'resist_fire', label: 'F/C Res' },
      { stat: 'resist_energy', label: 'E/N Res' },
      { stat: 'resist_psionic', label: 'Psi Res' },
      { stat: 'resist_toxic', label: 'Toxic Res' },
      { stat: 'mez_hold', label: 'Hold' },
      { stat: 'mez_stun', label: 'Stun' },
      { stat: 'mez_immob', label: 'Immob' },
      { stat: 'mez_sleep', label: 'Sleep' },
      { stat: 'mez_confuse', label: 'Confuse' },
      { stat: 'mez_fear', label: 'Fear' },
      { stat: 'mez_kb', label: 'KB' },
    ],
  },
  {
    name: 'Endurance',
    colorKey: 'endurance',
    stats: [
      { stat: 'maxend', label: 'Max End' },
      { stat: 'recovery', label: 'Recovery' },
      { stat: 'endreduction', label: 'End Reduction' },
    ],
  },
  {
    name: 'Health',
    colorKey: 'health',
    stats: [
      { stat: 'health', label: 'Max HP' },
      { stat: 'regeneration', label: 'Regeneration' },
    ],
  },
  {
    name: 'Movement',
    colorKey: 'movement',
    stats: [
      { stat: 'runspeed', label: 'Run Speed' },
      { stat: 'flyspeed', label: 'Fly Speed' },
      { stat: 'jumpspeed', label: 'Jump Speed' },
      { stat: 'jumpheight', label: 'Jump Height' },
    ],
  },
  {
    name: 'Debuff Resistance',
    colorKey: 'debuffResist',
    stats: [
      { stat: 'debuff_slow', label: 'Slow Res' },
      { stat: 'debuff_defense', label: 'Def Debuff Res' },
      { stat: 'debuff_recharge', label: 'Rech Debuff Res' },
      { stat: 'debuff_endurance', label: 'End Drain Res' },
      { stat: 'debuff_recovery', label: 'Rec Debuff Res' },
      { stat: 'debuff_tohit', label: 'ToHit Debuff Res' },
      { stat: 'debuff_regen', label: 'Regen Debuff Res' },
      { stat: 'debuff_perception', label: 'Percep Res' },
    ],
  },
];

// Get all stat IDs for toggle all functionality
const ALL_STAT_IDS = STAT_CATEGORIES.flatMap((cat) => cat.stats.map((s) => s.stat));

interface StatsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsConfigModal({ isOpen, onClose }: StatsConfigModalProps) {
  const statsConfig = useUIStore((s) => s.statsConfig);
  const setStatVisible = useUIStore((s) => s.setStatVisible);
  const reorderStats = useUIStore((s) => s.reorderStats);
  const resetStatsConfig = useUIStore((s) => s.resetStatsConfig);
  const includeProcsInStats = useUIStore((s) => s.includeProcsInStats);
  const toggleIncludeProcsInStats = useUIStore((s) => s.toggleIncludeProcsInStats);

  // Local state for editing before applying
  const [localConfig, setLocalConfig] = useState<StatDisplayConfig[]>(() => {
    // Ensure all stats exist in config
    const existingStats = new Set(statsConfig.map((s) => s.stat));
    const newConfig = [...statsConfig];

    ALL_STAT_IDS.forEach((statId, index) => {
      if (!existingStats.has(statId)) {
        newConfig.push({
          stat: statId,
          visible: false,
          order: statsConfig.length + index,
        });
      }
    });

    return newConfig;
  });

  const isStatVisible = (stat: string) => {
    return localConfig.find((s) => s.stat === stat)?.visible ?? false;
  };

  const toggleStat = (stat: string) => {
    setLocalConfig((prev) =>
      prev.map((s) =>
        s.stat === stat ? { ...s, visible: !s.visible } : s
      )
    );
  };

  const toggleCategory = (categoryStats: { stat: string }[]) => {
    const statIds = categoryStats.map((s) => s.stat);
    const allVisible = statIds.every((id) => isStatVisible(id));

    setLocalConfig((prev) =>
      prev.map((s) =>
        statIds.includes(s.stat) ? { ...s, visible: !allVisible } : s
      )
    );
  };

  const toggleAll = () => {
    const allVisible = ALL_STAT_IDS.every((id) => isStatVisible(id));
    setLocalConfig((prev) =>
      prev.map((s) => ({ ...s, visible: !allVisible }))
    );
  };

  const handleReset = () => {
    resetStatsConfig();
    // Reset local config - set recommended stats visible, all others hidden
    const defaultVisibleStats = new Set([
      'damage', 'accuracy', 'recharge', 'recovery',
      'defense_melee', 'defense_ranged', 'resist_smashing', 'health'
    ]);
    setLocalConfig(
      ALL_STAT_IDS.map((stat, index) => ({
        stat,
        visible: defaultVisibleStats.has(stat),
        order: index,
      }))
    );
  };

  const handleApply = () => {
    // Apply local config to store
    reorderStats(localConfig);
    localConfig.forEach((config) => {
      setStatVisible(config.stat, config.visible);
    });
    onClose();
  };

  const visibleCount = localConfig.filter((s) => s.visible).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Dashboard Stats"
      size="lg"
    >
      <ModalBody className="p-0">
        {/* Info banner */}
        <div className="px-4 py-2 bg-blue-900/30 border-b border-gray-700">
          <p className="text-sm text-blue-300">
            Select which stats to display on the dashboard.
            <span className="text-gray-400 ml-1">
              ({visibleCount} selected, 8 recommended for optimal display)
            </span>
          </p>
        </div>

        {/* Toggle all buttons + Procs toggle */}
        <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            Toggle All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="ml-auto flex items-center bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
            <Toggle
              id="include-procs-toggle"
              name="includeProcs"
              checked={includeProcsInStats}
              onChange={toggleIncludeProcsInStats}
              label="Include Procs"
            />
          </div>
        </div>

        {/* Category sections */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {STAT_CATEGORIES.map((category) => {
            const categoryStatIds = category.stats.map((s) => s.stat);
            const allCategoryVisible = categoryStatIds.every((id) => isStatVisible(id));
            const someCategoryVisible = categoryStatIds.some((id) => isStatVisible(id));
            const colors = CATEGORY_COLORS[category.colorKey];

            return (
              <div key={category.name} className={`border ${colors.border} rounded-lg overflow-hidden`}>
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category.stats)}
                  className={`w-full flex items-center gap-3 px-3 py-2 ${colors.headerBg} hover:brightness-110 transition-all`}
                >
                  <div
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                      ${allCategoryVisible
                        ? colors.toggleOn
                        : someCategoryVisible
                          ? `${colors.toggleOn} opacity-60`
                          : colors.toggleOff
                      }
                    `}
                  >
                    {(allCategoryVisible || someCategoryVisible) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${colors.text}`}>{category.name}</span>
                  <span className={`text-xs ${colors.text} opacity-70 ml-auto`}>
                    {categoryStatIds.filter((id) => isStatVisible(id)).length}/{category.stats.length}
                  </span>
                </button>

                {/* Stat toggles - color coded pill buttons */}
                <div className="flex flex-wrap gap-2 p-3 bg-gray-900/80">
                  {category.stats.map((stat) => {
                    const isVisible = isStatVisible(stat.stat);
                    // Use stat-specific color override if available, otherwise category color
                    const statColors = stat.colorOverride
                      ? CATEGORY_COLORS[stat.colorOverride]
                      : colors;
                    return (
                      <button
                        key={stat.stat}
                        onClick={() => toggleStat(stat.stat)}
                        className={`
                          px-3 py-1.5 rounded-full text-sm font-medium transition-all
                          border-2 ${statColors.border}
                          ${isVisible
                            ? `${statColors.bg} text-white shadow-md`
                            : `bg-transparent ${statColors.text} opacity-60 hover:opacity-100`
                          }
                        `}
                      >
                        {stat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
}
