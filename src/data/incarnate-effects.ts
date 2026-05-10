/**
 * Incarnate Effects Data
 *
 * Curated lookup table for incarnate power effects.
 * These values are extracted from the game data and used to:
 * 1. Display effects in tooltips
 * 2. Apply stat bonuses to the dashboard when powers are toggled active
 *
 * Note: Alpha powers provide "enhancement" bonuses (boost all powers)
 * Destiny/Hybrid provide direct stat bonuses (defense, resistance, damage, etc.)
 * Interface provides proc-based debuffs (not direct player stats)
 * Judgement/Lore are clickable attacks/pets (not passive stats)
 */

import type { IncarnateSlotId } from '@/types';
import {
  GENERATED_ALPHA_EFFECTS as HC_ALPHA,
  GENERATED_DESTINY_EFFECTS as HC_DESTINY,
  GENERATED_HYBRID_EFFECTS as HC_HYBRID,
  GENERATED_INTERFACE_EFFECTS as HC_INTERFACE,
  GENERATED_JUDGEMENT_EFFECTS as HC_JUDGEMENT,
  GENERATED_LORE_EFFECTS as HC_LORE,
} from './datasets/homecoming/generated/incarnate-effects';
import {
  GENERATED_ALPHA_EFFECTS as REBIRTH_ALPHA,
  GENERATED_DESTINY_EFFECTS as REBIRTH_DESTINY,
  GENERATED_HYBRID_EFFECTS as REBIRTH_HYBRID,
  GENERATED_INTERFACE_EFFECTS as REBIRTH_INTERFACE,
  GENERATED_JUDGEMENT_EFFECTS as REBIRTH_JUDGEMENT,
  GENERATED_LORE_EFFECTS as REBIRTH_LORE,
} from './datasets/rebirth/generated/incarnate-effects';
import { getActiveDataset } from './dataset';

// Lazy per-dataset accessors. The active dataset isn't loaded yet at module
// evaluation time, so we resolve on demand.
function _isRebirth(): boolean {
  return getActiveDataset().id === 'rebirth';
}

// ============================================
// TYPES
// ============================================

/**
 * Enhancement bonuses from Alpha slot (boost power effectiveness)
 *
 * Alpha slot abilities provide enhancement bonuses that apply to ALL powers
 * that accept that enhancement type. A portion of these bonuses bypass
 * Enhancement Diversification (ED), with the ratio depending on rarity:
 * - Common: 1/6 (~16.7%) bypasses ED
 * - Uncommon Core/Radial: 1/3 (~33.3%) bypasses ED
 * - Rare (Total/Partial): 1/2 (50%) bypasses ED
 * - Very Rare (Paragon): 2/3 (~66.7%) bypasses ED
 */
export interface AlphaEffects {
  // Enhancement bonuses (percentage as decimal, e.g., 0.45 = 45%)
  damage?: number;
  accuracy?: number;
  recharge?: number;
  enduranceReduction?: number;
  enduranceModification?: number;
  range?: number;
  heal?: number;
  defense?: number;
  resistance?: number;
  hold?: number;
  immobilize?: number;
  stun?: number;
  sleep?: number;
  fear?: number;
  confuse?: number;
  slow?: number;
  toHitDebuff?: number;
  defenseDebuff?: number;
  toHitBuff?: number;
  taunt?: number;
  runSpeed?: number;
  jumpSpeed?: number;
  flySpeed?: number;
  absorb?: number;
  // Special: Level shift
  levelShift?: number;
  // ED bypass ratio (portion of bonus that bypasses Enhancement Diversification)
  // Common: 1/6, Uncommon: 1/3, Rare: 1/2, VeryRare: 2/3
  edBypass?: number;
}

/**
 * Direct stat bonuses from Destiny slot
 * Note: Destiny effects diminish over time; we store initial (peak) values
 */
export interface DestinyEffects {
  // Defense (all positions/types)
  defenseAll?: number;
  // Resistance (all damage types)
  resistanceAll?: number;
  // Resistance to debuffs (defense, regen, recovery, recharge, tohit, ...).
  // Distinct from `resistanceAll` — Ageless Radial Epiphany grants 50%
  // debuff resistance, not 50% damage resistance.
  debuffResistance?: number;
  // Healing
  healPercent?: number;
  // Recovery/Regeneration
  recovery?: number;
  regeneration?: number;
  // Max HP/End
  maxHP?: number;
  maxEndurance?: number;
  // Recharge
  recharge?: number;
  // Damage buff
  damage?: number;
  // ToHit buff
  toHit?: number;
  // Mez protection
  mezProtection?: number;
  // Level shift
  levelShift?: number;
  // Duration info
  initialDuration?: number;  // Duration of peak effect
  totalDuration?: number;    // Total duration before recharge
}

/**
 * Stat bonuses from Hybrid slot (toggle powers)
 *
 * Three-layer model:
 * - passive: Always-on just by equipping (stat key → decimal)
 * - frontLoaded: Active when toggle is on, no enemies required (stat key → decimal)
 * - perTarget: Stacks per nearby enemy up to maxTargets (stat key → decimal per enemy)
 *
 * Stat keys use the same names as GlobalBonuses (e.g. 'regeneration', 'resSmashing', 'defMelee')
 */
export interface HybridEffects {
  tree: string;
  /** Passive bonuses — always-on just by equipping (stat → decimal) */
  passive: Record<string, number>;
  /** Front-loaded bonuses — active when toggle is on, no enemies required (stat → decimal) */
  frontLoaded: Record<string, number>;
  /** Per-target bonuses — stacks per nearby enemy (stat → decimal per enemy) */
  perTarget: Record<string, number>;
  /** Maximum enemies for per-target stacking */
  maxTargets: number;
  duration: number;
  recharge: number;
}

/**
 * Interface proc effects (for display only, not dashboard stats)
 */
export interface InterfaceEffects {
  // Debuff type and magnitude
  debuffType?: string;  // e.g., "-Resistance", "-Defense", "-Regen"
  debuffMagnitude?: number;
  debuffDuration?: number;

  // DoT type and damage
  dotType?: string;  // e.g., "Fire", "Cold", "Toxic"
  dotDamage?: number;       // damage scale value
  dotDuration?: number;
  dotTableName?: string;    // AT table for DoT calc (e.g., "Melee_Tempdamage")

  // Proc chance
  procChance?: number;
}

/**
 * Judgement click attack effects (for display, not dashboard stats)
 */
export interface JudgementEffects {
  damageType: string;        // e.g., "Cold", "Energy", "Smashing", "Fire", "Negative Energy"
  effectArea: string;        // e.g., "Cone", "Chain", "PBAoE", "Targeted AoE", "Self Cone"
  range: number;             // in feet
  radius: number;            // in feet (0 for chain)
  arc: number;               // in degrees (0 for non-cones)
  maxTargets: number;        // 0 for chain powers
  activationTime: number;    // seconds
  rechargeTime: number;      // seconds (always 90)
  damageScale: number;       // usually 4.0
  tableName: string;         // AT table for damage calc (e.g., "Ranged_Tempdamage")
  secondaryEffects: string[];  // descriptive strings for display
}

/**
 * Lore pet summoning effects (for display, not dashboard stats)
 */
export interface LoreEffects {
  faction: string;           // display name e.g., "Arachnos"
  pets: string[];            // e.g., ['Boss', 'Support (Protected)']
  duration: number;          // pet duration in seconds
  rechargeTime: number;      // seconds (900 or 600)
  levelShift: number;        // 0 for T1/T2, 1 for T3/T4
}

/**
 * Combined incarnate power effects
 */
export interface IncarnatePowerEffects {
  powerName: string;
  displayName: string;
  slotId: IncarnateSlotId;
  alpha?: AlphaEffects;
  destiny?: DestinyEffects;
  hybrid?: HybridEffects;
  interface?: InterfaceEffects;
  judgement?: JudgementEffects;
  lore?: LoreEffects;
}

// ============================================
// ALPHA EFFECTS DATA
// ============================================

// Alpha data auto-generated — see scripts/convert-incarnate-effects.cjs
const _alphaCache = new Map<string, Record<string, AlphaEffects>>();
function alphaEffects(): Record<string, AlphaEffects> {
  const id = getActiveDataset().id;
  let r = _alphaCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_ALPHA : HC_ALPHA) as Record<string, AlphaEffects>;
    _alphaCache.set(id, r);
  }
  return r;
}

// ============================================
// DESTINY EFFECTS DATA
// ============================================

// Destiny data auto-generated — see scripts/convert-incarnate-effects.cjs
const _destinyCache = new Map<string, Record<string, DestinyEffects>>();
function destinyEffects(): Record<string, DestinyEffects> {
  const id = getActiveDataset().id;
  let r = _destinyCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_DESTINY : HC_DESTINY) as Record<string, DestinyEffects>;
    _destinyCache.set(id, r);
  }
  return r;
}

// ============================================
// HYBRID EFFECTS DATA
// ============================================

// Hybrid data auto-generated — see scripts/convert-incarnate-effects.cjs
const _hybridCache = new Map<string, Record<string, HybridEffects>>();
function hybridEffects(): Record<string, HybridEffects> {
  const id = getActiveDataset().id;
  let r = _hybridCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_HYBRID : HC_HYBRID) as unknown as Record<string, HybridEffects>;
    _hybridCache.set(id, r);
  }
  return r;
}

// ============================================
// INTERFACE EFFECTS DATA
// ============================================

// Interface data auto-generated — see scripts/convert-incarnate-effects.cjs
const _interfaceCache = new Map<string, Record<string, InterfaceEffects>>();
function interfaceEffectsRegistry(): Record<string, InterfaceEffects> {
  const id = getActiveDataset().id;
  let r = _interfaceCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_INTERFACE : HC_INTERFACE) as unknown as Record<string, InterfaceEffects>;
    _interfaceCache.set(id, r);
  }
  return r;
}

// ============================================
// JUDGEMENT EFFECTS DATA
// ============================================

// Judgement data auto-generated — see scripts/convert-incarnate-effects.cjs
const _judgementCache = new Map<string, Record<string, JudgementEffects>>();
function judgementEffectsRegistry(): Record<string, JudgementEffects> {
  const id = getActiveDataset().id;
  let r = _judgementCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_JUDGEMENT : HC_JUDGEMENT) as unknown as Record<string, JudgementEffects>;
    _judgementCache.set(id, r);
  }
  return r;
}

// ============================================
// LORE EFFECTS DATA
// ============================================

// All 21 factions share identical tier structures — only faction name and entity names differ.
// Generated programmatically to avoid 189 manual entries.

// Lore data auto-generated — see scripts/convert-incarnate-effects.cjs
const _loreCache = new Map<string, Record<string, LoreEffects>>();
function loreEffectsRegistry(): Record<string, LoreEffects> {
  const id = getActiveDataset().id;
  let r = _loreCache.get(id);
  if (!r) {
    r = (_isRebirth() ? REBIRTH_LORE : HC_LORE) as unknown as Record<string, LoreEffects>;
    _loreCache.set(id, r);
  }
  return r;
}

// ============================================
// LOOKUP FUNCTIONS
// ============================================

/**
 * Normalize power ID for lookup (remove slot prefix, convert to lowercase with underscores)
 */
function normalizePowerId(powerId: string): string {
  // Remove common prefixes
  let normalized = powerId
    .toLowerCase()
    .replace(/^incarnate\.(alpha|judgement|interface|destiny|lore|hybrid)\./, '')
    .replace(/[.\s-]/g, '_');

  return normalized;
}

/**
 * Get Alpha effects for a power
 */
export function getAlphaEffects(powerId: string): AlphaEffects | null {
  const normalized = normalizePowerId(powerId);
  return alphaEffects()[normalized] || null;
}

/**
 * Get Destiny effects for a power
 */
export function getDestinyEffects(powerId: string): DestinyEffects | null {
  const normalized = normalizePowerId(powerId);
  return destinyEffects()[normalized] || null;
}

/**
 * Alias map for Hybrid Melee/Support powers.
 *
 * The UI data loader uses slot-index internal names from the bin-crawler
 * export (e.g. `Melee_Core_Embodiment`), but incarnate-effects-generated
 * is built from a different extraction pass where the internal names are
 * numeric suffixes (e.g. `Melee_Genome_8`). Order matches the position in
 * the hybrid powerset index — that's the stable contract between the two
 * name spaces.
 */
const HYBRID_ID_ALIASES: Record<string, string> = {
  // Melee tree (9 powers, in powerset order)
  'melee_genome': 'melee_genome_1',
  'melee_core_genome': 'melee_genome_2',
  'melee_radial_genome': 'melee_genome_3',
  'melee_total_core_graft': 'melee_genome_4',
  'melee_partial_core_graft': 'melee_genome_5',
  'melee_partial_radial_graft': 'melee_genome_6',
  'melee_total_radial_graft': 'melee_genome_7',
  'melee_core_embodiment': 'melee_genome_8',
  'melee_radial_embodiment': 'melee_genome_9',
  // Support tree (9 powers — support_genome keeps its name, rest are numeric)
  'support_core_genome': 'support_genome_2',
  'support_radial_genome': 'support_genome_3',
  'support_total_core_graft': 'support_genome_4',
  'support_partial_core_graft': 'support_genome_5',
  'support_partial_radial_graft': 'support_genome_6',
  'support_total_radial_graft': 'support_genome_7',
  'support_core_embodiment': 'support_genome_8',
  'support_radial_embodiment': 'support_genome_9',
};

/**
 * Get Hybrid effects for a power
 */
export function getHybridEffects(powerId: string): HybridEffects | null {
  const normalized = normalizePowerId(powerId);
  const key = HYBRID_ID_ALIASES[normalized] || normalized;
  return hybridEffects()[key] || null;
}

/**
 * Get Interface effects for a power
 */
export function getInterfaceEffects(powerId: string): InterfaceEffects | null {
  const normalized = normalizePowerId(powerId);
  return interfaceEffectsRegistry()[normalized] || null;
}

/**
 * Get Judgement effects for a power
 */
export function getJudgementEffects(powerId: string): JudgementEffects | null {
  const normalized = normalizePowerId(powerId);
  return judgementEffectsRegistry()[normalized] || null;
}

/**
 * Get Lore effects for a power
 */
export function getLoreEffects(powerId: string): LoreEffects | null {
  const normalized = normalizePowerId(powerId);
  return loreEffectsRegistry()[normalized] || null;
}

/**
 * Get effects for any incarnate power based on its slot
 */
export function getIncarnateEffects(
  slotId: IncarnateSlotId,
  powerId: string
): AlphaEffects | DestinyEffects | HybridEffects | InterfaceEffects | JudgementEffects | LoreEffects | null {
  switch (slotId) {
    case 'alpha':
      return getAlphaEffects(powerId);
    case 'destiny':
      return getDestinyEffects(powerId);
    case 'hybrid':
      return getHybridEffects(powerId);
    case 'interface':
      return getInterfaceEffects(powerId);
    case 'judgement':
      return getJudgementEffects(powerId);
    case 'lore':
      return getLoreEffects(powerId);
    default:
      return null;
  }
}

/**
 * Format effect value as percentage string
 */
export function formatEffectPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Format effect value with sign
 */
export function formatEffectValue(value: number, isPercent = true): string {
  const sign = value >= 0 ? '+' : '';
  if (isPercent) {
    return `${sign}${(value * 100).toFixed(1)}%`;
  }
  return `${sign}${value.toFixed(2)}`;
}
