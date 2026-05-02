/**
 * Shared utility functions and constants for power display components.
 * Used by both PowerInfoTooltip and InfoPanel to avoid code duplication.
 */

import type {
  ArchetypeId,
  ConditionalEffect,
  DefenseByType,
  ResistanceByType,
  MovementByType,
  NumberOrScaled,
  Power,
  PowerEffects,
  ScaledDamageEntry,
  SelectedPower,
} from '@/types';
import { getScaleValue } from '@/types';
import type { CharacterGlobalBonuses } from '@/utils/calculations';
import { getTableValue } from '@/data/at-tables';
import { getArchetype } from '@/data/archetypes';

// ============================================
// ARCHETYPE CAPS (sourced from archetypes.ts)
// ============================================

export function getDamageCap(archetypeId: string): number {
  return getArchetype(archetypeId as ArchetypeId)?.stats.damageCap ?? 4.0;
}

export function getDefenseCap(archetypeId: string): number {
  return getArchetype(archetypeId as ArchetypeId)?.stats.defenseCap ?? 0.45;
}

export function getResistanceCap(archetypeId: string): number {
  return getArchetype(archetypeId as ArchetypeId)?.stats.resistanceCap ?? 0.75;
}

// ============================================
// TABLE BASE VALUES
// These are the base percentages per scale point from AT tables
// ============================================
export const TABLE_BASE_VALUES: Record<string, number> = {
  // Resistance tables (10% per scale)
  'melee_res_dmg': 0.10,
  'ranged_res_dmg': 0.10,
  'melee_debuff_res_dmg': 0.10,
  'ranged_debuff_res_dmg': 0.10,
  // Defense tables (varies, but typically around 2-3% per scale for buffs)
  'melee_buff_def': 0.02,
  'ranged_buff_def': 0.02,
  'melee_debuff_def': 0.05,
  'ranged_debuff_def': 0.05,
  // Slow/Movement tables
  'ranged_slow': 0.10,
  'melee_slow': 0.10,
  // Default fallback
  'default': 0.10,
};

/**
 * Base values for buff/debuff effects per scale point at modifier 1.0
 * In City of Heroes, debuffs and buffs use different base scaling:
 * - Debuffs (ToHit, Defense, Resistance debuffs): 5% per scale (0.05)
 * - Buffs (Damage, Defense, ToHit buffs): 10% per scale (0.10)
 */
export const BASE_DEBUFF = 0.05;  // 5% per scale for debuffs
export const BASE_BUFF = 0.10;    // 10% per scale for buffs

export type EffectCategory = 'buff' | 'debuff';

/**
 * Get the base value for a table name.
 * If archetype and level are provided, uses AT-specific tables first.
 */
export function getTableBaseValue(tableName: string | undefined, archetype?: string, level?: number): number {
  if (!tableName) return TABLE_BASE_VALUES['default'];
  const key = tableName.toLowerCase();

  // "Ones" tables (Melee_Ones, Ranged_Ones) are constant 1.0 for all ATs
  if (key.endsWith('_ones')) return 1.0;

  // Try AT-specific table first
  if (archetype) {
    const atValue = getTableValue(archetype, key, level ?? 50);
    if (atValue !== undefined) return atValue;
  }

  return TABLE_BASE_VALUES[key] ?? TABLE_BASE_VALUES['default'];
}

/**
 * Calculate the final percentage value for a resistance/defense effect
 * Formula: scale × table_base_value (AT-specific when archetype provided)
 */
export function calculateResistancePercent(effect: NumberOrScaled | undefined, archetype?: string, level?: number): number {
  if (!effect) return 0;
  if (typeof effect === 'number') return effect;
  const baseValue = getTableBaseValue(effect.table, archetype, level);
  return effect.scale * baseValue;
}

/**
 * Check if all values in an array are approximately the same
 */
export function allValuesSame(values: number[]): boolean {
  if (values.length === 0) return true;
  const first = values[0];
  return values.every(v => Math.abs(v - first) < 0.001);
}

/**
 * Check if an effect value is a "by-type" object (DefenseByType, ResistanceByType, MovementByType)
 * vs a simple NumberOrScaled value
 */
export function isByTypeObject(value: NumberOrScaled | DefenseByType | ResistanceByType | MovementByType | undefined): value is DefenseByType | ResistanceByType | MovementByType {
  if (!value) return false;
  if (typeof value === 'number') return false;
  // ScaledEffect has 'scale' and 'table'
  if ('scale' in value && 'table' in value) return false;
  // Otherwise it's a ByType object with damage/defense type keys
  return true;
}

/**
 * Get the first/total value from a by-type object for simple display
 * Returns the first defined value, used when displaying a single summary value
 */
export function getByTypeFirstValue(byType: DefenseByType | ResistanceByType | MovementByType): NumberOrScaled | undefined {
  // Defense/Resistance type keys
  const defResKeys = ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic', 'melee', 'ranged', 'aoe'];
  // Movement type keys
  const movementKeys = ['runSpeed', 'flySpeed', 'jumpHeight', 'jumpSpeed', 'fly', 'movementControl', 'movementFriction'];
  const allKeys = [...defResKeys, ...movementKeys];
  for (const key of allKeys) {
    if ((byType as Record<string, NumberOrScaled | undefined>)[key] !== undefined) {
      return (byType as Record<string, NumberOrScaled | undefined>)[key];
    }
  }
  return undefined;
}

/**
 * Get the effective buff/debuff modifier for the powerset
 * - Defender/Controller PRIMARY support: uses their full buffDebuffModifier
 * - Corruptor/Mastermind SECONDARY support: uses 1.0 (base rate, not their primary modifier)
 * - Others: uses 1.0
 */
export function getEffectiveBuffDebuffModifier(powerSet: string, archetypeModifier: number): number {
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
 * Accepts both number (legacy) and ScaledEffect (new format) as input.
 */
export function calculateBuffDebuffValue(
  scaleOrEffect: NumberOrScaled,
  effectiveModifier: number,
  category: EffectCategory = 'buff'
): number {
  const scale = getScaleValue(scaleOrEffect);
  if (scale === undefined || scale === 0) return 0;
  const baseValue = category === 'debuff' ? BASE_DEBUFF : BASE_BUFF;
  return scale * baseValue * effectiveModifier;
}

/**
 * Format a decimal value as a percentage string
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Type labels for damage/defense/resistance types (short form)
 */
export const TYPE_LABELS_SHORT: Record<string, string> = {
  smashing: 'S', lethal: 'L', fire: 'F', cold: 'C',
  energy: 'E', negative: 'N', psionic: 'P', toxic: 'T',
  melee: 'Mel', ranged: 'Rng', aoe: 'AoE',
};

/**
 * Type labels for damage/defense/resistance types (full form)
 */
export const TYPE_LABELS_FULL: Record<string, string> = {
  smashing: 'Smash', lethal: 'Lethal', fire: 'Fire', cold: 'Cold',
  energy: 'Energy', negative: 'Neg', psionic: 'Psi', toxic: 'Toxic',
  melee: 'Melee', ranged: 'Ranged', aoe: 'AoE', all: 'All',
  // Movement speed types (used by slow effects)
  runSpeed: 'Run', flySpeed: 'Fly', jumpSpeed: 'Jump', jumpHeight: 'Jump Height',
  // Debuff resistance stat types
  defense: 'Defense', endurance: 'End', tohit: 'ToHit',
  movement: 'Slow', regeneration: 'Regen', recovery: 'Recovery',
  recharge: 'Recharge', perception: 'Percep',
  // Resistance subtypes
  heal: 'Heal',
  // Mez types (for -Special/+Special display)
  hold: 'Hold', stun: 'Stun', immobilize: 'Immob',
  sleep: 'Sleep', confuse: 'Confuse', fear: 'Fear',
  knockback: 'KB', knockup: 'KU', repel: 'Repel',
};

/**
 * Movement type labels
 */
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  runSpeed: 'Run Speed', flySpeed: 'Fly Speed',
  jumpSpeed: 'Jump Speed', jumpHeight: 'Jump Height',
  fly: 'Flight', movementControl: 'Move Control', movementFriction: 'Friction',
};

/**
 * Three-tier calculation result
 */
export interface ThreeTierValues {
  base: number;
  enhanced: number;
  final: number;
}

/**
 * Calculate three-tier stats (Base/Enhanced/Final) for key values.
 *
 * This is the single source of truth for three-tier math. All display
 * components (InfoPanel, PowerInfoTooltip, SharedPowerComponents)
 * should delegate to this function rather than implementing their own formulas.
 *
 * Formulas by aspect type:
 * - Reductions (endurance, recharge): base / (1 + bonus) — lower is better
 * - Multiplicative (everything else): base * (1 + bonus) — higher is better
 */
export function calcThreeTier(
  aspect: string,
  baseValue: number,
  enhancementBonuses: Record<string, number | undefined>,
  globalBonuses: Record<string, number | undefined>
): ThreeTierValues {
  const enhBonus = enhancementBonuses[aspect] || 0;
  const globalBonus = globalBonuses[aspect] || 0;

  let enhanced: number;
  let final: number;

  if (aspect === 'endurance' || aspect === 'recharge') {
    // Divisive reduction: base / (1 + bonus) — matches CoH game formula
    // Enhancement and global bonuses combine ADDITIVELY in one denominator
    enhanced = baseValue / Math.max(1, 1 + enhBonus);
    final = baseValue / Math.max(1, 1 + enhBonus + globalBonus);
  } else {
    // Strength multiplier: base * (1 + bonus) — matches CoH game formula
    // Enhancement and global bonuses combine ADDITIVELY in one multiplier
    enhanced = baseValue * (1 + enhBonus);
    final = baseValue * (1 + enhBonus + globalBonus);
  }

  return { base: baseValue, enhanced, final };
}

// ============================================
// GLOBAL BONUS CONVERSION
// ============================================

/**
 * Maps enhancement aspect keys to their corresponding CharacterGlobalBonuses field names.
 * Only aspects where a global bonus directly modifies a power's output are included.
 *
 * This is the single source of truth for bridging the dashboard's global stats
 * (percentage values, e.g. 50 = +50%) with the per-power three-tier calculation
 * (decimal multipliers, e.g. 0.5 = +50%).
 *
 * Add new entries here when the dashboard gains a global bonus that should affect
 * per-power calculations (e.g. a new global heal bonus).
 */
const GLOBAL_BONUS_ASPECT_MAP: [string, keyof CharacterGlobalBonuses][] = [
  ['damage', 'damage'],
  ['accuracy', 'accuracy'],
  ['recharge', 'recharge'],
  ['endurance', 'endurance'],
  ['range', 'range'],
  ['tohit', 'toHit'],
  ['heal', 'healOther'],
];

/**
 * Convert CharacterGlobalBonuses (percentage values from the dashboard calculation)
 * to enhancement-aspect-keyed decimal multipliers for three-tier power display.
 *
 * Used by InfoPanel and PowerInfoTooltip to ensure consistent
 * global bonus application across all power display surfaces.
 */
export function convertGlobalBonusesToAspects(
  globalBonuses: CharacterGlobalBonuses
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [aspect, field] of GLOBAL_BONUS_ASPECT_MAP) {
    const value = globalBonuses[field];
    if (value) {
      result[aspect] = value / 100;
    }
  }
  return result;
}

/**
 * Find a selected power from the build by name
 */
export function findSelectedPowerInBuild(
  powerName: string,
  build: {
    primary: { powers: SelectedPower[] };
    secondary: { powers: SelectedPower[] };
    pools: { powers: SelectedPower[] }[];
    epicPool?: { powers: SelectedPower[] } | null;
    inherents: SelectedPower[];
  }
): SelectedPower | null {
  const primary = build.primary.powers.find((p) => p.internalName === powerName);
  if (primary) return primary;
  const secondary = build.secondary.powers.find((p) => p.internalName === powerName);
  if (secondary) return secondary;
  for (const pool of build.pools) {
    const poolPower = pool.powers.find((p) => p.internalName === powerName);
    if (poolPower) return poolPower;
  }
  if (build.epicPool) {
    const epic = build.epicPool.powers.find((p) => p.internalName === powerName);
    if (epic) return epic;
  }
  // Check inherent powers
  const inherent = build.inherents.find((p) => p.internalName === powerName);
  if (inherent) return inherent;
  return null;
}

// ============================================
// BY-TYPE EXPANSION HELPERS
// ============================================

/**
 * Mez protection type labels for expanded protection rows
 */
const MEZ_LABELS: Record<string, string> = {
  stun: 'Stun', hold: 'Hold', immobilize: 'Immob',
  sleep: 'Sleep', confuse: 'Confuse', fear: 'Fear', knockback: 'KB',
};

/**
 * Expand a by-type object (DefenseByType, ResistanceByType, ElusivityByType)
 * into individual type entries with calculated percentage values.
 *
 * If all values are the same, returns a single summary entry with label "Def (All)".
 * Otherwise returns per-type entries like "Def: Smash", "Def: Lethal".
 */
export function expandByTypeEntries(
  obj: Record<string, unknown>,
  labelPrefix: string,
  archetype?: string,
  level?: number
): Array<{ typeKey: string; typeLabel: string; basePercent: number }> {
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return [];

  const resolved = entries.map(([typeKey, value]) => ({
    typeKey,
    basePercent: calculateResistancePercent(value as NumberOrScaled, archetype, level) * 100,
  }));

  // When all types share the same value and cover all primary damage types, show a single "(All)" row
  const percentValues = resolved.map(r => r.basePercent);
  const ALL_PRIMARY_DAMAGE_TYPES = ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic'];
  const typeKeys = new Set(resolved.map(r => r.typeKey));
  const hasAllKey = typeKeys.has('all');
  const coversAllPrimary = hasAllKey || ALL_PRIMARY_DAMAGE_TYPES.every(t => typeKeys.has(t));
  if (allValuesSame(percentValues) && coversAllPrimary) {
    return [{
      typeKey: '_all',
      typeLabel: `${labelPrefix} (All)`,
      basePercent: resolved[0].basePercent,
    }];
  }

  return resolved.map(({ typeKey, basePercent }) => ({
    typeKey,
    typeLabel: `${labelPrefix}: ${TYPE_LABELS_FULL[typeKey] || typeKey}`,
    basePercent,
  }));
}

/**
 * Expand ProtectionEffects into individual mez type entries.
 * Returns entries like "Prot: Stun", "Prot: Hold" with magnitude values.
 */
export function expandProtectionEntries(
  protection: Record<string, number>,
  labelPrefix: string
): Array<{ typeKey: string; typeLabel: string; magnitude: number }> {
  const entries = Object.entries(protection).filter(([, v]) => v !== undefined && v !== 0);
  if (entries.length === 0) return [];

  return entries.map(([typeKey, value]) => ({
    typeKey,
    typeLabel: `${labelPrefix}: ${MEZ_LABELS[typeKey] || typeKey}`,
    magnitude: value,
  }));
}

// ============================================
// CONDITIONAL EFFECT MERGING
// ============================================

/**
 * Conditional `id`s that correspond to AT-inherent mechanics already
 * driven by the Header's mechanic bar (Domination, Hide, Fury, etc.).
 * For these ids:
 *   - The MechanicAdjusters InfoPanel section hides its toggle (the
 *     Header already owns the user-facing control).
 *   - `selectActiveConditionals` reads the corresponding existing state
 *     via the `atInherentState` argument instead of `mechanicAdjusters` /
 *     `globalAdjusters`. The merger still layers the binary's actual
 *     conditional templates on top of the base when the AT toggle is on.
 *
 * Add new mappings here when a freshly-recognized gate id collides with
 * something the dashboard already controls. Keep curated rather than
 * auto-detected — the binary uses opaque attribute names like
 * `kStealth` that map to different mechanics per AT.
 */
export const AT_INHERENT_CONDITIONAL_IDS: ReadonlySet<string> = new Set([
  'domination',  // kStealth source> on Dominator powers
]);

/** State passed into `selectActiveConditionals` for AT-inherent lookup. */
export interface ATInherentState {
  dominationActive?: boolean;
  // Future entries when more AT inherents map to bin-level conditional gates:
  // stalkerHidden?: boolean;
  // furyLevel?: number;       // truthy iff > 0
  // scourgeActive?: boolean;
  // criticalHitsActive?: boolean;
  // containmentActive?: boolean;
  // sentinelCritActive?: boolean;
  // supremacyActive?: boolean;
}

/**
 * Pick the active subset of `power.conditionalEffects` based on the current
 * Mechanic Adjuster toggle state.
 *
 * Each entry's `scope` decides which map is consulted:
 * - `scope: 'global'` → caster-state mechanics share state across powers
 *   (Bio Armor adaptations, Hide, Domination, In Combat) and look up by
 *   bare `id` in `globalAdjusters`.
 * - `scope: 'per-power'` (or unspecified) → target-state mechanics keyed
 *   by `<powerName>:<id>` in `mechanicAdjusters`.
 *
 * Exception: ids in `AT_INHERENT_CONDITIONAL_IDS` are looked up via
 * `atInherentState` so the existing Header toggles drive them. Avoids
 * duplicating the user-facing control in two places.
 *
 * Falls back to the entry's `defaultActive` when the user hasn't touched
 * the toggle. The empty-array fast path is the common case.
 */
export function selectActiveConditionals(
  power: Power,
  mechanicAdjusters: Record<string, boolean>,
  globalAdjusters: Record<string, boolean>,
  atInherentState: ATInherentState = {},
): ConditionalEffect[] {
  const list = power.conditionalEffects;
  if (!list || list.length === 0) return [];
  const active: ConditionalEffect[] = [];
  for (const c of list) {
    const def = !!c.defaultActive;
    let on: boolean;
    if (AT_INHERENT_CONDITIONAL_IDS.has(c.id)) {
      // Read from the existing AT-inherent state instead of the new
      // mechanic-adjuster maps so the Header's toggle is the single
      // source of truth.
      switch (c.id) {
        case 'domination':
          on = atInherentState.dominationActive ?? def;
          break;
        default:
          on = def;
          break;
      }
    } else if (c.scope === 'global') {
      const v = globalAdjusters[c.id];
      on = v === undefined ? def : v;
    } else {
      const v = mechanicAdjusters[`${power.internalName}:${c.id}`];
      on = v === undefined ? def : v;
    }
    if (on) active.push(c);
  }
  return active;
}

/**
 * Layer active conditional contributions on top of the base power's damage
 * and effects. Returns a new Power object suitable for downstream damage
 * calculation / effect rendering.
 *
 * Merging rules respect each conditional's `mode`:
 *
 * - **Damage** is always concatenated. Each active conditional's `damage`
 *   entries append to the base array. Calc downstream sums them up just
 *   like multi-component base damage (Charged Shot's Disintegration bonus
 *   stacks on top of base when toggled on).
 *
 * - **Effects** depend on `mode`:
 *   - `mode: 'replace'` (mutex with a base sibling): shallow-merge — the
 *     conditional's fields override base on shared keys. Suffocate's
 *     drowning -Def replaces base "if NOT drowning" -Def. Bio Armor's
 *     selected adaptation replaces baseline self-buffs.
 *   - `mode: 'additive'` (default — independent stacking): merge fields
 *     the base doesn't have, but **leave shared keys untouched**. Two
 *     simultaneous mez instances aren't displayed as one combined row
 *     yet, so we avoid replacing the base mez with a misleading single-
 *     instance "stronger" version. Suffocate's Stealthed hold doesn't
 *     bump the displayed hold duration; the additional hold cast is the
 *     intended game behavior, awaiting multi-instance display.
 */
export function applyActiveConditionals(
  power: Power,
  active: ConditionalEffect[],
): Power {
  if (active.length === 0) return power;

  // --- damage ---
  const baseDamageArr: ScaledDamageEntry[] = power.damage
    ? Array.isArray(power.damage)
      ? [...power.damage]
      : [power.damage]
    : [];
  const merged: ScaledDamageEntry[] = baseDamageArr;
  for (const c of active) {
    if (!c.damage) continue;
    if (Array.isArray(c.damage)) merged.push(...c.damage);
    else merged.push(c.damage);
  }
  const nextDamage: Power['damage'] =
    merged.length === 0 ? undefined
      : merged.length === 1 ? merged[0]
        : merged;

  // --- effects ---
  let nextEffects: PowerEffects | undefined = power.effects ? { ...power.effects } : undefined;
  for (const c of active) {
    if (!c.effects) continue;
    if (c.mode === 'replace') {
      // Mutex with a base sibling — shallow-merge with conditional winning.
      nextEffects = nextEffects ? { ...nextEffects, ...c.effects } : { ...c.effects };
    } else {
      // Additive (default) — only fill keys the base doesn't have, so a
      // duplicate mez/buff entry from the conditional doesn't masquerade
      // as a stronger version of the base. Same-keyed entries represent
      // a second simultaneous instance which the calc/display layer
      // doesn't yet model as a stacked pair.
      if (!nextEffects) {
        nextEffects = { ...c.effects };
      } else {
        for (const [k, v] of Object.entries(c.effects)) {
          if (!(k in nextEffects)) {
            (nextEffects as Record<string, unknown>)[k] = v;
          }
        }
      }
    }
  }

  return { ...power, damage: nextDamage, effects: nextEffects };
}
