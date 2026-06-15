/**
 * StatsConfigModal - Configure which stats to display on the dashboard
 * Mirrors the legacy stats selector functionality
 */

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import type { StatDisplayConfig } from '@/types';
import { groupStatsBySection } from '@/data/stat-definitions';
import type { StatCategory } from '@/data/stat-definitions';

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
  // Mez/Status - pink
  mez: {
    bg: 'bg-pink-500',
    border: 'border-pink-400',
    text: 'text-pink-400',
    headerBg: 'bg-pink-900/40',
    toggleOn: 'bg-pink-500 border-pink-400',
    toggleOff: 'border-pink-400/50',
  },
  // Stealth/Perception - indigo
  stealth: {
    bg: 'bg-indigo-500',
    border: 'border-indigo-400',
    text: 'text-indigo-400',
    headerBg: 'bg-indigo-900/40',
    toggleOn: 'bg-indigo-500 border-indigo-400',
    toggleOff: 'border-indigo-400/50',
  },
  // Incarnate - amber
  incarnate: {
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    text: 'text-amber-400',
    headerBg: 'bg-amber-900/40',
    toggleOn: 'bg-amber-500 border-amber-400',
    toggleOff: 'border-amber-400/50',
  },
};

type CategoryColorKey = keyof typeof CATEGORY_COLORS;

// Documented color key for the dashboard. Hue encodes WHICH stat group a value
// belongs to (so you can scan "all my defense numbers" at a glance) — it does
// NOT mean good vs bad. Good/bad is conveyed by the secondary cues below, so
// the system never relies on hue alone (color-vision-deficiency safe).
const HUE_LEGEND: { swatch: string; meaning: string }[] = [
  { swatch: 'bg-red-400',    meaning: 'Damage' },
  { swatch: 'bg-yellow-400', meaning: 'Accuracy / To-Hit' },
  { swatch: 'bg-purple-400', meaning: 'Defense' },
  { swatch: 'bg-orange-400', meaning: 'Resistance · End Cost' },
  { swatch: 'bg-blue-400',   meaning: 'Endurance / Recovery' },
  { swatch: 'bg-green-400',  meaning: 'Health / Regen / Heal' },
  { swatch: 'bg-teal-400',   meaning: 'Movement speed' },
  { swatch: 'bg-pink-400',   meaning: 'Mez & status protection' },
  { swatch: 'bg-cyan-400',   meaning: 'Debuff resistance' },
  { swatch: 'bg-slate-300',  meaning: 'Recharge & neutral stats' },
];

// Stat categories matching legacy app with color coding
interface StatToggle { stat: string; label: string; colorOverride?: CategoryColorKey }

// Settings → Stats display sections. Stat→section placement is single-sourced
// via STAT_CATEGORY (stat-definitions.ts); this only names the toggle sections,
// their accent color, and which canonical categories each contains.
const SETTINGS_SECTIONS: { name: string; colorKey: CategoryColorKey; categories: StatCategory[] }[] = [
  // "General" folds Stealth/Perception in with Offense to mirror the compact
  // dashboard tile (see DASHBOARD_SECTIONS). Per-stat colorOverrides keep the
  // stealth stats their own hue inside this damage-accented section.
  { name: 'General', colorKey: 'damage', categories: ['offense', 'stealth-perception'] },
  { name: 'Survival & Mobility', colorKey: 'health', categories: ['health-endurance', 'movement'] },
  { name: 'Defense', colorKey: 'defense', categories: ['defense'] },
  { name: 'Resistance', colorKey: 'resistance', categories: ['resistance'] },
  { name: 'Status Protection', colorKey: 'mez', categories: ['status-protection'] },
  { name: 'Status Resistance', colorKey: 'mez', categories: ['status-resistance'] },
  { name: 'Debuff Resistance', colorKey: 'debuffResist', categories: ['debuff-resistance'] },
];

// The toggleable stats with their full settings labels + per-stat accent
// overrides. Uses the compact `mez_*` status-protection variants (not the
// detailed sheet's `prot_*`). Order is irrelevant — groupStatsBySection orders
// within each section by the canonical STAT_SECTIONS order.
const SETTINGS_STATS: StatToggle[] = [
  { stat: 'damage', label: 'Damage', colorOverride: 'damage' },
  { stat: 'accuracy', label: 'Accuracy', colorOverride: 'accuracy' },
  { stat: 'tohit', label: 'To-Hit', colorOverride: 'accuracy' },
  { stat: 'recharge', label: 'Recharge', colorOverride: 'recharge' },
  { stat: 'range_bonus', label: 'Range' },
  { stat: 'threat_level', label: 'Threat', colorOverride: 'resistance' },
  { stat: 'level_shift', label: 'Level Shift', colorOverride: 'incarnate' },
  { stat: 'health', label: 'Max HP' },
  { stat: 'regeneration', label: 'Regeneration' },
  { stat: 'heal_other', label: 'Heal Other', colorOverride: 'health' },
  { stat: 'maxend', label: 'Max End', colorOverride: 'endurance' },
  { stat: 'recovery', label: 'Recovery', colorOverride: 'endurance' },
  { stat: 'endreduction', label: 'End Reduction', colorOverride: 'endurance' },
  { stat: 'endcost', label: 'End Cost', colorOverride: 'resistance' },
  { stat: 'netend', label: 'Net End', colorOverride: 'endurance' },
  { stat: 'runspeed', label: 'Run Speed', colorOverride: 'movement' },
  { stat: 'flyspeed', label: 'Fly Speed', colorOverride: 'movement' },
  { stat: 'jumpspeed', label: 'Jump Speed', colorOverride: 'movement' },
  { stat: 'jumpheight', label: 'Jump Height', colorOverride: 'movement' },
  { stat: 'stealth_pve', label: 'Stealth (PvE)', colorOverride: 'stealth' },
  { stat: 'stealth_pvp', label: 'Stealth (PvP)', colorOverride: 'stealth' },
  { stat: 'perception_bonus', label: 'Perception', colorOverride: 'stealth' },
  { stat: 'defense_melee', label: 'Melee' },
  { stat: 'defense_ranged', label: 'Ranged' },
  { stat: 'defense_aoe', label: 'AoE' },
  { stat: 'def_smashing', label: 'Smashing' },
  { stat: 'def_lethal', label: 'Lethal' },
  { stat: 'def_fire', label: 'Fire' },
  { stat: 'def_cold', label: 'Cold' },
  { stat: 'def_energy', label: 'Energy' },
  { stat: 'def_negative', label: 'Negative' },
  { stat: 'def_psionic', label: 'Psionic' },
  { stat: 'def_toxic', label: 'Toxic' },
  { stat: 'res_smashing', label: 'Smashing' },
  { stat: 'res_lethal', label: 'Lethal' },
  { stat: 'res_fire', label: 'Fire' },
  { stat: 'res_cold', label: 'Cold' },
  { stat: 'res_energy', label: 'Energy' },
  { stat: 'res_negative', label: 'Negative' },
  { stat: 'res_psionic', label: 'Psionic' },
  { stat: 'res_toxic', label: 'Toxic' },
  { stat: 'mez_hold', label: 'Hold' },
  { stat: 'mez_stun', label: 'Stun' },
  { stat: 'mez_immob', label: 'Immob' },
  { stat: 'mez_sleep', label: 'Sleep' },
  { stat: 'mez_confuse', label: 'Confuse' },
  { stat: 'mez_fear', label: 'Fear' },
  { stat: 'mez_kb', label: 'KB' },
  { stat: 'prot_repel', label: 'Repel' },
  { stat: 'prot_teleport', label: 'Teleport' },
  { stat: 'mezres_hold', label: 'Hold' },
  { stat: 'mezres_stun', label: 'Stun' },
  { stat: 'mezres_immob', label: 'Immob' },
  { stat: 'mezres_sleep', label: 'Sleep' },
  { stat: 'mezres_confuse', label: 'Confuse' },
  { stat: 'mezres_fear', label: 'Fear' },
  { stat: 'mezres_kb', label: 'KB' },
  { stat: 'mezres_taunt', label: 'Taunt' },
  { stat: 'mezres_placate', label: 'Placate' },
  { stat: 'debuff_slow', label: 'Slow' },
  { stat: 'debuff_defense', label: 'Defense' },
  { stat: 'debuff_recharge', label: 'Recharge' },
  { stat: 'debuff_endurance', label: 'End Drain' },
  { stat: 'debuff_recovery', label: 'Recovery' },
  { stat: 'debuff_tohit', label: 'ToHit' },
  { stat: 'debuff_regen', label: 'Regen' },
  { stat: 'debuff_perception', label: 'Perception' },
];

// Toggle sections, with each section's stats grouped + ordered from the shared
// canonical placement. Same shape the render below expects ({ name, colorKey,
// stats }).
const STAT_CATEGORIES = groupStatsBySection(SETTINGS_STATS, (s) => s.stat, SETTINGS_SECTIONS);

// Get all stat IDs for toggle all functionality
const ALL_STAT_IDS = SETTINGS_STATS.map((s) => s.stat);

interface StatsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsConfigModal({ isOpen, onClose }: StatsConfigModalProps) {
  const statsConfig = useUIStore((s) => s.statsConfig);
  const setStatVisible = useUIStore((s) => s.setStatVisible);
  const reorderStats = useUIStore((s) => s.reorderStats);
  const resetStatsConfig = useUIStore((s) => s.resetStatsConfig);
  const openProcSettingsModal = useUIStore((s) => s.openProcSettingsModal);
  const scrollToStatId = useUIStore((s) => s.statsConfigScrollTo);
  const clearStatsConfigScrollTo = useUIStore((s) => s.clearStatsConfigScrollTo);

  // Refs for each category section so we can scroll-to + flash-highlight one
  // when the dashboard's gear icon was clicked with a deep-link target.
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [flashedCategory, setFlashedCategory] = useState<string | null>(null);
  const [showColorKey, setShowColorKey] = useState(false);

  useEffect(() => {
    if (!isOpen || !scrollToStatId) return;
    const targetCategory = STAT_CATEGORIES.find((cat) =>
      cat.stats.some((s) => s.stat === scrollToStatId),
    );
    if (!targetCategory) {
      clearStatsConfigScrollTo();
      return;
    }
    // Defer one frame so the modal has mounted its scroll container.
    const id = requestAnimationFrame(() => {
      const el = categoryRefs.current[targetCategory.name];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setFlashedCategory(targetCategory.name);
        setTimeout(() => setFlashedCategory(null), 1200);
      }
      clearStatsConfigScrollTo();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, scrollToStatId, clearStatsConfigScrollTo]);

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
      'damage', 'accuracy', 'recharge', 'recovery', 'endcost',
      'defense_melee', 'defense_ranged', 'res_smashing', 'health'
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

        {/* Color key — documents the dashboard's color system. Collapsed by
            default to keep the modal focused on stat selection. */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => setShowColorKey((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50 transition-colors"
            aria-expanded={showColorKey}
          >
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showColorKey ? 'rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Color key</span>
            <span className="text-gray-400 text-xs">— what the dashboard colors mean</span>
          </button>
          {showColorKey && (
            <div className="px-4 pb-3 pt-1 space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Color tells you <span className="text-gray-200">which stat group</span> a value belongs
                to — not whether it's good or bad. Whether a value is good or bad is shown by the cues below,
                so you never have to rely on color alone.
              </p>
              {/* Hue → stat group */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {HUE_LEGEND.map((row) => (
                  <div key={row.meaning} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${row.swatch}`} />
                    <span className="text-xs text-gray-300">{row.meaning}</span>
                  </div>
                ))}
              </div>
              {/* Secondary (non-color) cues for status & good/bad */}
              <div className="border-t border-gray-700/70 pt-2 space-y-1.5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status cues</div>
                <div className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-gray-100 underline decoration-dotted decoration-current underline-offset-2 flex-shrink-0">45.0%</span>
                  <span>Dotted underline — the value is at or above its cap (soft-capped).</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-gray-100 ring-1 ring-[var(--color-warning)]/70 rounded px-1 flex-shrink-0">45.0%</span>
                  <span>Warning ring — a contributing bonus was rejected by the Rule of 5.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="flex-shrink-0"><span className="text-emerald-400">+1.5/s</span> · <span className="text-red-400">−0.8/s</span></span>
                  <span>Sign shows direction; <span className="text-red-400">red</span> marks a deficit (e.g. negative Net End or over budget).</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle all buttons + Procs toggle */}
        <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            Toggle All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={openProcSettingsModal}
              className="bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50"
            >
              Proc Settings
            </Button>
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
              <div
                key={category.name}
                ref={(el) => { categoryRefs.current[category.name] = el; }}
                className={`border ${colors.border} rounded-lg overflow-hidden transition-shadow ${
                  flashedCategory === category.name ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/50' : ''
                }`}
              >
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
