/**
 * Archetype type definitions
 */

import type { Faction, PowerType } from './common';

// ============================================
// DAMAGE MODIFIERS
// ============================================

export interface DamageModifiers {
  melee: number;
  ranged: number;
  aoe: number;
}

// ============================================
// ARCHETYPE STATS
// ============================================

export interface ArchetypeStats {
  /** Base HP at level 50 (attrib_max.hit_points[49]) */
  baseHP: number;
  /** HP cap at level 50 (attrib_max_max.hit_points[49]) */
  maxHP: number;
  /** Base HP per level, index 0 = level 1 through index 49 = level 50 */
  hpTable: number[];
  /** HP cap per level, index 0 = level 1 through index 49 = level 50 */
  hpCapTable: number[];
  /** Base endurance pool */
  baseEndurance: number;
  /** Base endurance recovery rate */
  baseRecovery: number;
  /** Base threat level (aggro generation) */
  baseThreat: number;
  /** Damage modifiers by attack type */
  damageModifier: DamageModifiers;
  /** Buff/debuff effectiveness modifier */
  buffDebuffModifier: number;
  /** Total damage strength multiplier cap (e.g., 4.0 = 400%) */
  damageCap: number;
  /** RechargeTime net-strength FLOOR (`ClampStrength` StrengthMin — 0.25 on every player
   *  class, the −75% debuff floor: a power slows to at most 4× its base recharge). */
  rechargeFloor: number;
  /** RechargeTime net-strength CAP (`ClampStrength` StrengthMaxTable at level 50 — 5.0 on
   *  every player class, the +400% recharge cap). */
  rechargeCap: number;
  /** EnduranceDiscount net-strength FLOOR (`ClampStrength` StrengthMin — the epsilon the
   *  server adds to the divisor, so an endurance debuff is effectively unbounded). */
  enduranceFloor: number;
  /** EnduranceDiscount net-strength CAP (`ClampStrength` StrengthMaxTable at level 50). */
  enduranceCap: number;
  /** Defense cap as decimal (e.g., 0.45 = 45%) */
  defenseCap: number;
  /** Resistance cap as decimal (e.g., 0.75 = 75%) */
  resistanceCap: number;

  // The attribute ceilings recovered from classes.bin `AttribMaxTable` (CAPS-1). Each pairs a
  // BASE (the class's authored `AttribBase` scalar, in absolute attribute units) with a
  // per-level ceiling row, because a ceiling only becomes a percentage against that class's own
  // base — Arachnos Soldier/Widow author a higher regeneration base under the same ceiling and
  // so cap at 1667% where a Blaster caps at 2000%.

  /** ToHit base (0.75 on every class) — the 75% the game's hit-chance formula starts from. */
  toHitBase: number;
  /** Per-level ToHit ceiling, absolute. Index 0 = level 1. */
  toHitCapTable: number[];
  /** Regeneration base, absolute (HP-per-tick scale). */
  regenerationBase: number;
  /** Per-level regeneration ceiling, absolute — 2000/2500/3000% of base by class. */
  regenerationCapTable: number[];
  /** Recovery base, absolute (endurance-per-tick scale). */
  recoveryBase: number;
  /** Per-level recovery ceiling, absolute — 500/625/750% of base by class. */
  recoveryCapTable: number[];
  /** The REAL per-level defense clamp (~175-225%), not {@link defenseCap} — that scalar holds
   *  the 0.45 purple-patch softcap, which is a threshold and clamps nothing. */
  defenseCeilingTable: number[];
  /** The endurance pool per level, absolute points (100 on every shipped class). */
  maxEnduranceTable: number[];
  /** The per-level ceiling the pool is clamped to (120 at level 1 → 365 at 50). */
  maxEnduranceCapTable: number[];
}

// ============================================
// INHERENT POWER
// ============================================

export interface InherentPower {
  /** Display name of the inherent */
  name: string;
  /** Description of what it does */
  description: string;
  /** Optional icon override (defaults to auto-generated from archetype + power name) */
  icon?: string;
  /**
   * Activation type. Most archetype inherents are passive/always-on ('Auto'),
   * which is the default when this is omitted. Set explicitly for the rare
   * player-activated inherent — e.g. Dominator's Domination is a 'Click' with
   * a recharge/duration cycle, so it must be perma-trackable rather than
   * treated as an auto power.
   */
  powerType?: PowerType;
  /** Optional effects data (recharge, duration, etc.) for display in the info panel */
  effects?: import('./power').PowerEffects;
}

// ============================================
// ARCHETYPE BRANCHES (For Epic ATs like Arachnos)
// ============================================

export interface ArchetypeBranch {
  /** Display name of the branch (e.g., "Bane Spider", "Fortunata") */
  name: string;
  /** Level at which this branch becomes available */
  level: number;
  /** Additional primary powerset for this branch (optional) */
  primarySet?: string;
  /** Additional secondary powerset for this branch */
  secondarySet: string;
}

export type ArchetypeBranchId =
  | 'bane-spider'
  | 'crab-spider'
  | 'night-widow'
  | 'fortunata'
  // Thunderspy-only — custom third Widow branch
  | 'tarantula';

// ============================================
// ARCHETYPE DEFINITION
// ============================================

export interface Archetype {
  /** Display name (e.g., "Blaster") */
  name: string;
  /** Hero or villain */
  side: Faction;
  /** Short description of the archetype's role */
  description: string;
  /** The archetype's inherent power */
  inherent: InherentPower;
  /** Base stats and modifiers */
  stats: ArchetypeStats;
  /** Available primary powerset IDs (e.g., "blaster/fire-blast") */
  primarySets: string[];
  /** Available secondary powerset IDs */
  secondarySets: string[];
  /** Branching specializations (for Arachnos Epic ATs) */
  branches?: Partial<Record<ArchetypeBranchId, ArchetypeBranch>>;
}

// ============================================
// ARCHETYPE ID
// ============================================

export type ArchetypeId =
  // Heroes
  | 'blaster'
  | 'controller'
  | 'defender'
  | 'scrapper'
  | 'tanker'
  | 'sentinel'      // HC-only (i25)
  | 'guardian'      // Rebirth-only — Assault primary + Composition secondary
  // Villains
  | 'brute'
  | 'corruptor'
  | 'dominator'
  | 'mastermind'
  | 'stalker'
  // Epic Archetypes - Kheldians (Hero)
  | 'peacebringer'
  | 'warshade'
  // Epic Archetypes - Arachnos (Villain)
  | 'arachnos-soldier'
  | 'arachnos-widow'
  // Thunderspy-only — custom Kheldian-style form-shifter AT
  | 'primalist';

// ============================================
// ARCHETYPE REGISTRY
// ============================================

// Partial because not every dataset ships every archetype — Rebirth's i25
// snapshot predates HC's Sentinel addition, for example. Consumers already
// route most reads through `getArchetype(id)` which returns
// `Archetype | undefined`.
export type ArchetypeRegistry = Partial<Record<ArchetypeId, Archetype>>;
