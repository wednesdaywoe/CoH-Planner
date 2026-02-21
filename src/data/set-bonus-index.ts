/**
 * Set Bonus Index - Searchable index of all IO set bonuses
 *
 * Builds a flat, deduplicated index of every set bonus effect across all IO sets.
 * Supports Mids-style cascading filters: Effect → Type → Strength.
 *
 * Paired stats (S/L, F/C, E/N) are deduplicated so each bonus appears only once.
 */

import type { IOSetRarity, IOSet } from '@/types';
import { getAllIOSets } from './io-sets';
import { normalizeStatName, getPairedStat } from '@/utils/calculations/set-bonuses';

// ============================================
// TYPES
// ============================================

export interface LookupEntry {
  setId: string;
  setName: string;
  rarity: IOSetRarity;
  setType: string;        // What powers it enhances, e.g. "Ranged Damage", "Healing"
  icon: string;
  piecesRequired: number;
  effect: string;          // High-level category: "Defense", "Recharge", "Recovery", etc.
  effectType: string;      // Subtype within effect: "Smashing/Lethal", "Melee", "" if none
  value: number;
  desc: string;
  levelRange: string;
  pvp?: boolean;           // True if this bonus only applies in PvP zones
}

// ============================================
// EFFECT / TYPE MAPPING
// ============================================

/** Maps normalizedStat → effect + effectType for the lookup hierarchy */
const NORMALIZED_EFFECT_MAP: Record<string, { effect: string; effectType: string }> = {
  // Defense - positional
  defMelee:    { effect: 'Defense', effectType: 'Melee' },
  defRanged:   { effect: 'Defense', effectType: 'Ranged' },
  defAoE:      { effect: 'Defense', effectType: 'AoE' },
  // Defense - typed (paired stats map to same effectType for dedup)
  defSmashing: { effect: 'Defense', effectType: 'Smashing/Lethal' },
  defLethal:   { effect: 'Defense', effectType: 'Smashing/Lethal' },
  defFire:     { effect: 'Defense', effectType: 'Fire/Cold' },
  defCold:     { effect: 'Defense', effectType: 'Fire/Cold' },
  defEnergy:   { effect: 'Defense', effectType: 'Energy/Negative' },
  defNegative: { effect: 'Defense', effectType: 'Energy/Negative' },
  defPsionic:  { effect: 'Defense', effectType: 'Psionic' },
  defToxic:    { effect: 'Defense', effectType: 'Toxic' },
  // Resistance - typed
  resSmashing: { effect: 'Resistance', effectType: 'Smashing/Lethal' },
  resLethal:   { effect: 'Resistance', effectType: 'Smashing/Lethal' },
  resFire:     { effect: 'Resistance', effectType: 'Fire/Cold' },
  resCold:     { effect: 'Resistance', effectType: 'Fire/Cold' },
  resEnergy:   { effect: 'Resistance', effectType: 'Energy/Negative' },
  resNegative: { effect: 'Resistance', effectType: 'Energy/Negative' },
  resPsionic:  { effect: 'Resistance', effectType: 'Psionic' },
  resToxic:    { effect: 'Resistance', effectType: 'Toxic' },
  // Offense
  damage:   { effect: 'Damage', effectType: '' },
  accuracy: { effect: 'Accuracy', effectType: '' },
  tohit:    { effect: 'ToHit', effectType: '' },
  recharge: { effect: 'Recharge', effectType: '' },
  endrdx:   { effect: 'End Discount', effectType: '' },
  // Health & Endurance
  recovery:     { effect: 'Recovery', effectType: '' },
  regeneration: { effect: 'Regeneration', effectType: '' },
  maxhp:        { effect: 'Max HP', effectType: '' },
  maxend:       { effect: 'Max Endurance', effectType: '' },
  // Movement
  runspeed:   { effect: 'Run Speed', effectType: '' },
  flyspeed:   { effect: 'Fly Speed', effectType: '' },
  jumpspeed:  { effect: 'Jump', effectType: '' },
  jumpheight: { effect: 'Jump', effectType: '' },
};

/** Maps raw stat strings (ones that don't normalize) → effect + effectType */
const RAW_STAT_EFFECT_MAP: Record<string, { effect: string; effectType: string }> = {
  'defense_(all)':            { effect: 'Defense', effectType: 'All' },
  'damage_resistance_(all)':  { effect: 'Resistance', effectType: 'All' },
  'mez_resistance_(all)':     { effect: 'Mez Resistance', effectType: '' },
  'hold_duration':            { effect: 'Control Duration', effectType: 'Hold' },
  'stun_duration':            { effect: 'Control Duration', effectType: 'Stun' },
  'immobilize_duration':      { effect: 'Control Duration', effectType: 'Immobilize' },
  'sleep_duration':           { effect: 'Control Duration', effectType: 'Sleep' },
  'confuse_duration':         { effect: 'Control Duration', effectType: 'Confuse' },
  'terror_duration':          { effect: 'Control Duration', effectType: 'Fear' },
  'knockback_protection':     { effect: 'Knockback', effectType: 'Protection' },
  'knockback_resistance':     { effect: 'Knockback', effectType: 'Resistance' },
  'knockback_strength':       { effect: 'Knockback', effectType: 'Distance' },
  'healing_strength':         { effect: 'Healing', effectType: '' },
  'perception':               { effect: 'Perception', effectType: '' },
  'range':                    { effect: 'Range', effectType: '' },
  '+res(recharge_debuff)':    { effect: 'Slow Resistance', effectType: '' },
  'increased_run_speed':      { effect: 'Run Speed', effectType: '' },
};

/** Preferred display order for effects */
const EFFECT_ORDER: string[] = [
  'Defense', 'Resistance', 'Damage', 'Accuracy', 'ToHit', 'Recharge',
  'End Discount', 'Recovery', 'Regeneration', 'Max HP', 'Max Endurance',
  'Healing', 'Run Speed', 'Fly Speed', 'Jump',
  'Control Duration', 'Mez Resistance', 'Knockback',
  'Range', 'Perception', 'Slow Resistance',
];

// ============================================
// EFFECT/TYPE RESOLUTION
// ============================================

function resolveEffectType(rawStat: string): { effect: string; effectType: string } | null {
  // First try normalizing the stat
  const normalized = normalizeStatName(rawStat);

  if (normalized && NORMALIZED_EFFECT_MAP[normalized]) {
    return NORMALIZED_EFFECT_MAP[normalized];
  }

  // Try raw stat map (for stats that don't normalize or normalize to null/undefined)
  const lower = rawStat.toLowerCase();
  if (RAW_STAT_EFFECT_MAP[lower]) {
    return RAW_STAT_EFFECT_MAP[lower];
  }

  // Fallback pattern matching for any remaining stats
  if (lower.startsWith('defense')) return { effect: 'Defense', effectType: '' };
  if (lower.startsWith('damage_resistance')) return { effect: 'Resistance', effectType: '' };
  if (lower.includes('mez_resistance')) return { effect: 'Mez Resistance', effectType: '' };
  if (lower.includes('speed') || lower.includes('jump') || lower === 'increased_movement') {
    return { effect: 'Run Speed', effectType: '' };
  }
  if (lower.includes('hitpoint') || lower.includes('health')) return { effect: 'Max HP', effectType: '' };
  if (lower.includes('endurance')) return { effect: 'Max Endurance', effectType: '' };
  if (lower === 'recovery') return { effect: 'Recovery', effectType: '' };
  if (lower === 'regeneration') return { effect: 'Regeneration', effectType: '' };

  return null; // Unknown — will be skipped
}

// ============================================
// INDEX BUILDING
// ============================================

let _lookupIndex: LookupEntry[] | null = null;

function buildLookupIndex(): LookupEntry[] {
  const allSets = getAllIOSets();
  const seen = new Set<string>(); // For deduplicating paired stats
  const entries: LookupEntry[] = [];

  for (const [setId, ioSet] of Object.entries(allSets)) {
    const levelRange = `${ioSet.minLevel}-${ioSet.maxLevel}`;

    for (const bonus of ioSet.bonuses) {
      for (const fx of bonus.effects) {
        const resolved = resolveEffectType(fx.stat);
        if (!resolved) continue; // Skip truly unknown stats

        // Dedup key: paired stats (e.g., defSmashing & defLethal) map to the same
        // effect+effectType, so only one entry is created per unique combo
        const dedupKey = `${setId}|${bonus.pieces}|${resolved.effect}|${resolved.effectType}|${fx.value}`;
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);

        entries.push({
          setId,
          setName: ioSet.name,
          rarity: ioSet.category,
          setType: ioSet.type,
          icon: ioSet.icon,
          piecesRequired: bonus.pieces,
          effect: resolved.effect,
          effectType: resolved.effectType,
          value: fx.value,
          desc: fx.desc,
          levelRange,
          ...(fx.pvp && { pvp: true }),
        });
      }
    }
  }

  return entries;
}

// ============================================
// PUBLIC API
// ============================================

export function getLookupIndex(): LookupEntry[] {
  if (!_lookupIndex) {
    _lookupIndex = buildLookupIndex();
  }
  return _lookupIndex;
}

/**
 * Get all unique effects, in preferred display order
 */
export function getEffects(): string[] {
  const index = getLookupIndex();
  const present = new Set<string>();
  for (const entry of index) {
    present.add(entry.effect);
  }
  // Return in preferred order, then any extras alphabetically
  const ordered = EFFECT_ORDER.filter(e => present.has(e));
  const extras = Array.from(present).filter(e => !EFFECT_ORDER.includes(e)).sort();
  return [...ordered, ...extras];
}

/**
 * Get subtypes available for a given effect (data-driven)
 * Returns empty array if the effect has no subtypes (e.g., Recharge)
 */
export function getTypesForEffect(effect: string): string[] {
  const index = getLookupIndex();
  const types = new Set<string>();
  for (const entry of index) {
    if (entry.effect === effect && entry.effectType) {
      types.add(entry.effectType);
    }
  }
  return Array.from(types).sort();
}

/**
 * Get all unique strength (%) values for a given effect + optional type
 * Returns sorted ascending
 */
export function getStrengthsForFilter(effect: string, effectType?: string): number[] {
  const index = getLookupIndex();
  const values = new Set<number>();
  for (const entry of index) {
    if (entry.effect !== effect) continue;
    if (effectType && entry.effectType !== effectType) continue;
    values.add(entry.value);
  }
  return Array.from(values).sort((a, b) => a - b);
}

/**
 * Search the lookup index with Mids-style cascading filters
 */
export function searchBonusLookup(filters: {
  effect: string;
  effectType?: string;
  strength?: number;
}): LookupEntry[] {
  let results = getLookupIndex();

  // Filter by effect (required)
  results = results.filter(e => e.effect === filters.effect);

  // Filter by effectType (optional — only when the effect has subtypes)
  if (filters.effectType) {
    results = results.filter(e => e.effectType === filters.effectType);
  }

  // Filter by strength/value (optional)
  if (filters.strength !== undefined) {
    results = results.filter(e => e.value === filters.strength);
  }

  // Sort by set name, then pieces required
  results = [...results].sort((a, b) =>
    a.setName.localeCompare(b.setName) || a.piecesRequired - b.piecesRequired
  );

  return results;
}

/**
 * Check which tracked stats an IO set provides bonuses for.
 * Returns the set of matched breakdownKeys (empty if no match).
 *
 * @param ioSet - The IO set to check
 * @param trackedBreakdownKeys - breakdownKey values from the dashboard (e.g., 'recharge', 'defSmashing')
 */
export function getSetTrackedMatches(
  ioSet: IOSet,
  trackedBreakdownKeys: string[],
): Set<string> {
  if (trackedBreakdownKeys.length === 0) return new Set();

  // Build a map: normalizedStat → tracked breakdownKey(s) that care about it
  const targetMap = new Map<string, string>();
  for (const key of trackedBreakdownKeys) {
    targetMap.set(key, key);
    const pair = getPairedStat(key);
    if (pair) targetMap.set(pair, key);
  }

  const matched = new Set<string>();
  for (const bonus of ioSet.bonuses) {
    for (const fx of bonus.effects) {
      if (fx.pvp) continue; // PvP-only effects don't count for PvE stat tracking
      const normalized = normalizeStatName(fx.stat);
      if (normalized && targetMap.has(normalized)) {
        matched.add(targetMap.get(normalized)!);
      }
    }
  }

  return matched;
}
