/**
 * Shared detailed-totals computation — the stat-sheet model behind the
 * "Detailed Totals" modal AND the "Export as Image" build poster.
 *
 * Extracted from DetailedTotalsModal so both consumers build their rows from a
 * single source of truth. This module is render-agnostic: it turns calculated
 * stats + breakdowns into labelled, formatted, section-grouped `StatRow`s.
 * Rendering (breakdown panels, cap meters) stays in the individual views.
 */

import { formatBonusValue } from '@/utils/set-bonus-format';
import { getArchetype } from '@/data/archetypes';
import type { ArchetypeId } from '@/types';
import { STAT_DEFINITIONS, resolveStatValue, groupStatsBySection } from '@/data/stat-definitions';
import type { StatValue, MezStatValue, StatCategory } from '@/data/stat-definitions';
import type { CalculatedStats, DashboardStatBreakdown } from '@/hooks/useCalculatedStats';
import type { GlobalBonuses } from '@/utils/calculations/character-totals';
import { statCapFor, type StatCap } from '@/data/core/stat-caps';

// ============================================
// SECTIONS & STATS
// ============================================

// Display sections for the detailed sheet. Stat→section placement is
// single-sourced via STAT_CATEGORY (stat-definitions.ts); this only names the
// sections and maps the canonical categories into them. The detailed view
// keeps Offense and Movement separate and labels Resistance "Damage
// Resistance".
export const DETAILED_SECTIONS: { name: string; categories: StatCategory[] }[] = [
  { name: 'Offense', categories: ['offense'] },
  { name: 'Survival & Mobility', categories: ['health-endurance', 'movement'] },
  { name: 'Stealth & Perception', categories: ['stealth-perception'] },
  { name: 'Defense', categories: ['defense'] },
  { name: 'Damage Resistance', categories: ['resistance'] },
  { name: 'Status Protection', categories: ['status-protection'] },
  { name: 'Status Effect Resistance', categories: ['status-resistance'] },
  { name: 'Debuff Resistance', categories: ['debuff-resistance'] },
];

// Which stats the detailed sheet shows. It uses the `prot_*` magnitude variants
// for status protection (not the compact `mez_*`) and omits End Cost / Net End
// (those live on the dashboard's Survival & Mobility tile). Order is irrelevant
// here — groupStatsBySection orders within each section by the canonical
// STAT_SECTIONS order.
export const DETAILED_STATS: string[] = [
  'damage', 'accuracy', 'tohit', 'recharge', 'range_bonus', 'threat_level', 'level_shift',
  'health', 'absorb', 'regeneration', 'heal_other', 'heal_received', 'maxend', 'recovery', 'endreduction',
  'runspeed', 'flyspeed', 'jumpspeed', 'jumpheight',
  'stealth_pve', 'stealth_pvp', 'perception_bonus',
  'defense_melee', 'defense_ranged', 'defense_aoe',
  'def_smashing', 'def_lethal', 'def_fire', 'def_cold', 'def_energy', 'def_negative', 'def_psionic', 'def_toxic',
  'res_smashing', 'res_lethal', 'res_fire', 'res_cold', 'res_energy', 'res_negative', 'res_psionic', 'res_toxic',
  'prot_hold', 'prot_stun', 'prot_immob', 'prot_sleep', 'prot_confuse', 'prot_fear', 'prot_kb', 'prot_repel',
  'mezres_hold', 'mezres_stun', 'mezres_immob', 'mezres_sleep', 'mezres_confuse', 'mezres_fear', 'mezres_kb', 'mezres_taunt', 'mezres_placate',
  'debuff_slow', 'debuff_defense', 'debuff_recharge', 'debuff_endurance', 'debuff_recovery', 'debuff_tohit', 'debuff_regen', 'debuff_perception',
  'debuff_accuracy', 'debuff_range',
];

// ============================================
// TYPES
// ============================================

export interface StatRow {
  id: string;
  label: string;
  value: StatValue;
  format: (v: StatValue) => string;
  color: string;
  tooltip: string;
  breakdown?: DashboardStatBreakdown;
  breakdownKey?: string;
  breakdownUnit?: string;
  /** Constant added to the displayed total (Recharge → 100% base + bonuses,
   *  matching Mids' speed-multiplier "Haste" convention). */
  totalBaseOffset?: number;
  /** Optional override for the breakdown's total line (e.g. mez resistance shows
   *  the resulting duration %). Receives the raw summed total. */
  formatTotal?: (total: number) => string;
  /** Optional override for each per-source breakdown figure (returns the full
   *  string without a leading "+"). Status resistance uses it to show negative
   *  duration reductions. */
  formatBreakdownSource?: (raw: number) => string;
  /** The stat's ceiling and which kind it is. Present for defense/resistance stats. The kind
   *  travels with the number because the two are not interchangeable: resistance's is a clamp
   *  the engine already applied, defense's is a threshold the total legitimately runs past. */
  cap?: StatCap;
}

export interface StatSection {
  name: string;
  stats: StatRow[];
}

// ============================================
// COMPUTE
// ============================================

export function computeAllStats(
  stats: CalculatedStats,
  globalBonuses: GlobalBonuses,
  breakdowns: Map<string, DashboardStatBreakdown>,
  baseHP: number,
  maxHPCap: number,
  archetypeId: string | undefined,
  rechargeMidsStyle: boolean,
  /** The practical defense softcap for the caster's combat context — `getDefenseSoftcap`
   *  against the build's target-level offset and content mode. Passed in rather than derived
   *  because it depends on UI state this module deliberately cannot read, and because the
   *  archetype's own 45% is the even-level row only: at +6 the softcap is 50%, and the sheet
   *  must not disagree with the dashboard tile beside it. */
  defenseSoftcap: number,
): StatSection[] {
  const at = archetypeId ? getArchetype(archetypeId as ArchetypeId) : null;
  const resistanceCap = (at?.stats.resistanceCap ?? 0.75) * 100;

  return groupStatsBySection(DETAILED_STATS, (id) => id, DETAILED_SECTIONS).map((section) => ({
    name: section.name,
    stats: section.stats
      .map((id) => {
        const def = STAT_DEFINITIONS[id];
        if (!def) return null;

        const value = resolveStatValue(id, def, stats, globalBonuses, baseHP, maxHPCap);

        const breakdown = def.breakdownKey ? breakdowns.get(def.breakdownKey) : undefined;

        // Attach the ceiling — same decision the dashboard tile makes, from the same place.
        const cap = statCapFor(id, defenseSoftcap, resistanceCap);

        // Recharge display mode: opt out of the Mids-style 100% base offset
        // and revert to bonus-only "+X%" rendering. Mirrors the override in
        // StatsDashboard so the modal stays in sync with the headline tile.
        if (id === 'recharge' && !rechargeMidsStyle) {
          return {
            ...def,
            value,
            breakdown,
            cap,
            format: (v: StatValue) => {
              const n = Number(v);
              return `${n >= 0 ? '+' : ''}${formatBonusValue(n)}%`;
            },
            tooltip: 'Global recharge from set bonuses',
            totalBaseOffset: undefined,
          } as StatRow;
        }

        return { ...def, value, breakdown, cap } as StatRow;
      })
      .filter(Boolean) as StatRow[],
  }));
}

/** True when a stat value is non-zero (handles the compound mez / dual / rate value shapes). */
export function isNonZeroStat(v: StatValue): boolean {
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
