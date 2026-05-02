/**
 * Power and Powerset type definitions
 */

import type {
  DamageType,
  PowerType,
  TargetType,
  EffectArea,
  EnhancementStatType,
  IOSetCategory,
} from './common';

// ============================================
// SCALED EFFECT (new format with AT tables)
// ============================================

/** Effect with scale and table reference for AT-based calculations */
export interface ScaledEffect {
  /** Scale multiplier */
  scale: number;
  /** AT table name (e.g., "Ranged_Debuff_ToHit") */
  table: string;
  /** Per-stack scale increment for stacking buffs (per-target AoE or damage-triggered).
   *  At N stacks: effective_scale = scale + perTarget × (N - 1)
   *  For AoE powers, N = targets hit. For non-AoE, N = stack count (see maxStacks). */
  perTarget?: number;
}

/** Helper type for effects that can be number OR scaled */
export type NumberOrScaled = number | ScaledEffect;

/**
 * Extract scale value from NumberOrScaled
 * Returns the number directly, or the scale from ScaledEffect
 */
export function getScaleValue(value: NumberOrScaled | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return value.scale;
}

/**
 * Check if a value is a ScaledEffect (has scale and table)
 */
export function isScaledEffect(value: NumberOrScaled | undefined): value is ScaledEffect {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scale' in value &&
    'table' in value
  );
}

// ============================================
// DAMAGE EFFECT
// ============================================

export interface DamageEffect {
  /** Damage type (Fire, Smashing, etc.) */
  type: DamageType;
  /** Damage scale value */
  scale: number;
  /** Optional: damage table reference */
  table?: string;
}

export interface MultiDamageEffect {
  /** Multiple damage types */
  types: DamageEffect[];
  /** Combined scale */
  scale: number;
}

// ============================================
// DOT (DAMAGE OVER TIME) EFFECT
// ============================================

export interface DotEffect {
  /** Damage type */
  type: DamageType;
  /** Damage scale per tick */
  scale: number;
  /** Number of ticks */
  ticks: number;
}

// ============================================
// MEZ EFFECT (stun, hold, sleep, etc.)
// ============================================

/** Mez effect with magnitude, duration scale, and table */
export interface MezEffect {
  /** Mez magnitude (determines what rank of enemies are affected) */
  mag: number;
  /** Duration scale */
  scale: number;
  /** AT table for duration calculation */
  table: string;
}

/** Helper type for mez that can be number (magnitude only) OR full MezEffect */
export type NumberOrMez = number | MezEffect;

/**
 * Check if a mez value is a full MezEffect (has mag, scale, table)
 */
export function isMezEffect(value: NumberOrMez | undefined): value is MezEffect {
  return (
    typeof value === 'object' &&
    value !== null &&
    'mag' in value &&
    'scale' in value &&
    'table' in value
  );
}

// ============================================
// PROTECTION EFFECTS (mez protection magnitude)
// ============================================

export interface ProtectionEffects {
  stun?: number;
  hold?: number;
  immobilize?: number;
  sleep?: number;
  confuse?: number;
  fear?: number;
  knockback?: number;
  knockup?: number;
  repel?: number;
}

// ============================================
// DEFENSE/RESISTANCE BY DAMAGE TYPE
// ============================================

/** Defense values can be number (legacy) or ScaledEffect (new format) */
export interface DefenseByType {
  smashing?: NumberOrScaled;
  lethal?: NumberOrScaled;
  fire?: NumberOrScaled;
  cold?: NumberOrScaled;
  energy?: NumberOrScaled;
  negative?: NumberOrScaled;
  psionic?: NumberOrScaled;
  toxic?: NumberOrScaled;
  melee?: NumberOrScaled;
  ranged?: NumberOrScaled;
  aoe?: NumberOrScaled;
}

/** Resistance values can be number (legacy) or ScaledEffect (new format) */
export interface ResistanceByType {
  smashing?: NumberOrScaled;
  lethal?: NumberOrScaled;
  fire?: NumberOrScaled;
  cold?: NumberOrScaled;
  energy?: NumberOrScaled;
  negative?: NumberOrScaled;
  psionic?: NumberOrScaled;
  toxic?: NumberOrScaled;
  /** Heal resistance (affects incoming healing) */
  heal?: NumberOrScaled;
}

/** Elusivity (defense debuff resistance) by type */
export interface ElusivityByType {
  all?: NumberOrScaled;
  smashing?: NumberOrScaled;
  lethal?: NumberOrScaled;
  fire?: NumberOrScaled;
  cold?: NumberOrScaled;
  energy?: NumberOrScaled;
  negative?: NumberOrScaled;
  psionic?: NumberOrScaled;
  melee?: NumberOrScaled;
  ranged?: NumberOrScaled;
  aoe?: NumberOrScaled;
}

/** Movement effects (buffs or debuffs) */
export interface MovementByType {
  runSpeed?: NumberOrScaled;
  flySpeed?: NumberOrScaled;
  jumpHeight?: NumberOrScaled;
  jumpSpeed?: NumberOrScaled;
  fly?: NumberOrScaled;
  movementControl?: NumberOrScaled;
  movementFriction?: NumberOrScaled;
}

/** Stealth effects */
export interface StealthEffects {
  stealthPvE?: NumberOrScaled;
  stealthPvP?: NumberOrScaled;
  translucency?: NumberOrScaled;
}

// ============================================
// SUMMON EFFECT (pets/pseudopets)
// ============================================

/** Summoned entity (pet or pseudopet) */
export interface SummonEffect {
  /** True if this is a pseudopet (invisible location-based effect) */
  isPseudoPet: boolean;
  /** Entity definition name (for real pets) - key into PET_ENTITIES */
  entity?: string;
  /** Display name of the summoned entity */
  displayName?: string;
  /** Powers the entity uses (where actual effects come from) */
  powers?: string[];
  /** Duration of the summon in seconds */
  duration?: number;
  /** Number of entities summoned (e.g., Gremlins = 2) */
  entityCount?: number;
  /** True if the summon template has CopyBoosts flag (pet inherits caster's enhancements) */
  copyBoosts?: boolean;
  /** Multi-entity summons (e.g., Mastermind henchmen with different entity types) */
  entities?: { entity: string; count: number }[];
}

// ============================================
// HEALING EFFECT
// ============================================

export interface HealingEffect {
  scale: number;
  table?: string;
  perTarget?: boolean;
}

// ============================================
// DEBUFF RESISTANCE
// ============================================

export interface DebuffResistance {
  defense?: NumberOrScaled;
  recharge?: NumberOrScaled;
  movement?: NumberOrScaled; // Also known as "Slow" resistance
  tohit?: NumberOrScaled;
  endurance?: NumberOrScaled; // Endurance drain resistance
  regeneration?: NumberOrScaled; // Regeneration debuff resistance
  recovery?: NumberOrScaled; // Recovery debuff resistance
  perception?: NumberOrScaled; // Perception debuff resistance
  range?: NumberOrScaled; // Range debuff resistance
}

// ============================================
// MOVEMENT EFFECTS
// ============================================

export interface MovementEffect {
  scale: number;
  table?: string;
}

// ============================================
// POWER EFFECTS
// ============================================

export interface PowerEffects {
  /** Base accuracy modifier */
  accuracy?: number;
  /** Range in feet (0 for melee/self) */
  range?: number;
  /** Recharge time in seconds */
  recharge?: number;
  /** Endurance cost per tick (divide by activatePeriod for per-second) */
  enduranceCost?: number;
  /** Toggle tick interval in seconds (default 0.5). End/s = enduranceCost / activatePeriod */
  activatePeriod?: number;
  /** Cast/activation time in seconds */
  castTime?: number;
  /** Effect area type */
  effectArea?: EffectArea;
  /** Radius for AoE powers */
  radius?: number;
  /** Arc for cone powers */
  arc?: number;
  /** Max targets for AoE */
  maxTargets?: number;
  /** Direct damage (single or multi-type) */
  damage?: DamageEffect | MultiDamageEffect;
  /** Damage over time */
  dot?: DotEffect;
  /** Duration of buffs/debuffs */
  buffDuration?: number;
  /** Per-effect durations in seconds, keyed by effect name (e.g. { tohitDebuff: 6, rechargeBuff: 120 }) */
  durations?: Record<string, number>;

  // === BUFF EFFECTS ===
  /** ToHit buff value (scale or {scale, table}) */
  tohitBuff?: NumberOrScaled;
  /** Damage buff value (scale or {scale, table}) */
  damageBuff?: NumberOrScaled;
  /** Defense buff value - can be single value or by type */
  defenseBuff?: NumberOrScaled | DefenseByType;
  /** If true, defenseBuff only applies to teammates, not the caster (e.g., Grant Cover) */
  defenseBuffExcludesSelf?: boolean;
  /** Defense buff suppressed in combat (stealth/travel powers) */
  defenseBuffSuppressible?: NumberOrScaled | DefenseByType;
  /** Recharge buff value (percentage as decimal, e.g., 0.30 = 30%) */
  rechargeBuff?: NumberOrScaled;
  /** Recovery buff value (percentage as decimal) */
  recoveryBuff?: NumberOrScaled;
  /** Regeneration buff value */
  regenBuff?: NumberOrScaled;
  /** Regeneration buff value (unenhanceable — IgnoreStrength) */
  regenBuffUnenhanced?: NumberOrScaled;
  /** Run/Fly speed buff value (percentage as decimal) */
  speedBuff?: NumberOrScaled;
  /** Endurance buff value (flat value or scale) */
  enduranceBuff?: NumberOrScaled;
  /** Endurance gain (instant recovery) */
  enduranceGain?: NumberOrScaled;
  /** Max HP buff */
  maxHPBuff?: NumberOrScaled;
  /** Max Endurance buff */
  maxEndBuff?: NumberOrScaled;
  /** Range buff */
  rangeBuff?: NumberOrScaled;
  /** Endurance discount (reduced end cost) */
  enduranceDiscount?: NumberOrScaled;
  /** Threat level buff */
  threatBuff?: NumberOrScaled;
  /** Perception buff */
  perceptionBuff?: NumberOrScaled;
  /** Absorb shield */
  absorb?: NumberOrScaled;

  // === STACKING ===
  /** Max stacks for non-AoE stacking powers (e.g., Reactive Regeneration = 20).
   *  For AoE per-target powers, use stats.maxTargets instead. */
  maxStacks?: number;
  /** Names of effect keys whose scale multiplies linearly with stack count
   *  (e.g. ['absorb', 'debuffResistance'] for Psychokinetic Barrier).
   *  Effects not listed here are treated as refresh-only — they re-apply
   *  with full duration but their magnitude does not stack. Only meaningful
   *  when `maxStacks` is set. */
  stacksLinear?: string[];

  // === SELF-PENALTY FLAG ===
  /** If true, debuff fields (damageDebuff, slow, rechargeDebuff) are genuine self-penalties
   *  (e.g., Granite Armor, Defensive Adaptation). Most powers with these fields target enemies. */
  selfPenalty?: boolean;

  // === DEBUFF EFFECTS ===
  /** ToHit debuff value (scale or {scale, table}) */
  tohitDebuff?: NumberOrScaled;
  /** Defense debuff value - can be single value or by type */
  defenseDebuff?: NumberOrScaled | DefenseByType;
  /** Resistance debuff value - can be single value or by type */
  resistanceDebuff?: NumberOrScaled | ResistanceByType;
  /** Damage debuff value (scale) - reduces enemy damage output */
  damageDebuff?: NumberOrScaled;
  /** Regeneration debuff value (scale) */
  regenDebuff?: NumberOrScaled;
  /** Recovery debuff value (scale) */
  recoveryDebuff?: NumberOrScaled;
  /** Endurance drain */
  enduranceDrain?: NumberOrScaled;
  /** Endurance crash (flat endurance point loss after delay) */
  enduranceCrash?: number;
  /** Threat level debuff */
  threatDebuff?: NumberOrScaled;
  /** Perception debuff */
  perceptionDebuff?: NumberOrScaled;
  /** Recharge debuff (slow recharge) */
  rechargeDebuff?: NumberOrScaled;
  /** Movement/speed debuff (slow) - can be single value or by type */
  slow?: NumberOrScaled | MovementByType;
  /** -Special: reduces target's secondary effect strength (mez, buffs, etc.) */
  specialDebuff?: Record<string, NumberOrScaled>;
  /** +Special: boosts own/ally secondary effect strength */
  specialBuff?: Record<string, NumberOrScaled>;

  /** Duration of effects in seconds (for debuffs, DoTs, etc.) */
  effectDuration?: number;

  // === DEFENSE & RESISTANCE (armor sets) ===
  /** Defense values by damage type */
  defense?: DefenseByType;
  /** Resistance values by damage type */
  resistance?: ResistanceByType;
  /** Elusivity (defense debuff resistance) */
  elusivity?: ElusivityByType;
  /** Movement buffs */
  movement?: MovementByType;
  /** Stealth effects */
  stealth?: StealthEffects;
  /** Debuff resistance */
  debuffResistance?: DebuffResistance;
  /** Mez resistance (reduces mez duration) — per-type, e.g., { hold: { scale, table } } */
  mezResistance?: Record<string, NumberOrScaled>;

  // === HEALING ===
  /** Healing effect */
  healing?: HealingEffect;

  // === MEZ EFFECTS (control/stuns) ===
  // Can be number (magnitude only, legacy) or MezEffect (mag, scale, table)
  /** Stun effect */
  stun?: NumberOrMez;
  /** Hold effect */
  hold?: NumberOrMez;
  /** Immobilize effect */
  immobilize?: NumberOrMez;
  /** Sleep effect */
  sleep?: NumberOrMez;
  /** Fear effect */
  fear?: NumberOrMez;
  /** Confuse effect */
  confuse?: NumberOrMez;
  /** Knockback effect (scale/table, no mag) */
  knockback?: NumberOrScaled;
  /** Knockup effect (scale/table) */
  knockup?: NumberOrScaled;
  /** Repel effect (scale/table) */
  repel?: NumberOrScaled;
  /** Taunt effect */
  taunt?: NumberOrScaled;
  /** Placate effect */
  placate?: NumberOrScaled;
  /** Teleport effect */
  teleport?: NumberOrScaled;
  /** Fly (grants flight) */
  fly?: NumberOrScaled;
  /** Untouchable (intangible) */
  untouchable?: NumberOrScaled;
  /** Only affects self */
  onlyAffectsSelf?: NumberOrScaled;

  // === PROTECTION (mez protection for armors) ===
  /** Protection values granted */
  protection?: ProtectionEffects;

  // === SUMMON (pets/pseudopets) ===
  /** Summoned entity info */
  summon?: SummonEffect;

  // === LEGACY MOVEMENT (keep for backwards compatibility) ===
  /** @deprecated Use movement.runSpeed instead */
  runSpeed?: MovementEffect;
  /** @deprecated Use movement.jumpHeight instead */
  jumpHeight?: MovementEffect;
  /** @deprecated Use movement.jumpSpeed instead */
  jumpSpeed?: MovementEffect;
  /** @deprecated Use movement.flySpeed instead */
  flySpeed?: MovementEffect;
}

// ============================================
// POWER STATS (base power statistics)
// ============================================

export interface PowerStats {
  /** Base accuracy modifier */
  accuracy?: number;
  /** Range in feet (0 for melee/self) */
  range?: number;
  /** Radius for AoE powers */
  radius?: number;
  /** Recharge time in seconds */
  recharge?: number;
  /** Endurance cost (per tick — divide by activatePeriod for per-second) */
  endurance?: number;
  /** Toggle tick interval in seconds (default 0.5). End/s = endurance / activatePeriod */
  activatePeriod?: number;
  /** Cast/activation time in seconds */
  castTime?: number;
  /** Max targets for AoE */
  maxTargets?: number;
  /** Arc for cone powers */
  arc?: number;
}

// ============================================
// DAMAGE ARRAY (new format for AT tables)
// ============================================

export interface ScaledDamageEntry {
  type: string;
  scale: number;
  table: string;
  /** Duration for buff/effect-type damage entries */
  duration?: number;
  /** Tick rate for DoT entries */
  tickRate?: number;
}

// ============================================
// POWER DEFINITION
// ============================================

export interface Power {
  /** Power name */
  name: string;
  /** Internal name from raw data (e.g., "Radiation_Infection") — canonical stable identifier */
  internalName: string;
  /** Full internal name (e.g., "Pool.Speed.Hasten") */
  fullName?: string;
  /** Level available (0 = level 1, -1 = unlocked by prerequisite) */
  available: number;
  /** Tier within the powerset */
  tier?: number;
  /** Rank within a pool */
  rank?: number;
  /** Maximum enhancement slots */
  maxSlots: number;
  /** Allowed single enhancement types */
  allowedEnhancements: EnhancementStatType[];
  /** Allowed IO set categories */
  allowedSetCategories?: IOSetCategory[];
  /** Full description */
  description: string;
  /** Short help text shown in UI */
  shortHelp?: string;
  /** Icon filename */
  icon?: string;
  /** Click, Toggle, Auto, or Passive */
  powerType: PowerType;
  /** Target type */
  targetType?: TargetType;
  /** Effect area */
  effectArea?: EffectArea;
  /** Max targets for AoE */
  maxTargets?: number;
  /** Prerequisite power(s) - logical expression */
  requires?: string;
  /**
   * If set, this power is a mechanic (non-standard) power:
   * - 'childToggle': Auto-granted child toggle (ammo types, stance forms, adaptations)
   * - 'parentMechanic': Pickable parent that grants child toggles (Swap Ammo, Staff Mastery)
   * - 'hiddenPassive': Hidden intrinsic passive (Seismic Shockwaves)
   * - 'hiddenAuto': Completely hidden auto-power (Phoenix Rising)
   */
  mechanicType?: 'childToggle' | 'parentMechanic' | 'hiddenPassive' | 'hiddenAuto';
  /** Base stats for this power (new format) */
  stats?: PowerStats;
  /** Damage entries with scale and table (new format) - can be array or single entry */
  damage?: ScaledDamageEntry[] | ScaledDamageEntry;
  /** All effects of this power */
  effects?: PowerEffects;
  /** Quick-cast sniper form stats (used when in combat / Experienced Marksman) */
  quickSnipe?: {
    stats: Partial<PowerStats>;
    damage: ScaledDamageEntry | ScaledDamageEntry[];
  };
  /**
   * State-gated bonus effects. Each entry corresponds to a Mechanic Adjuster
   * toggle in the InfoPanel — when active, its `damage` and `effects` add on
   * top of the power's base. Surfaces what the converter's
   * `_isConditionalGate` filter strips from base damage / effects so the
   * underlying mechanic (drowning bonus, Disintegration bonus, Domination
   * boost, etc.) is still reachable.
   *
   * Source: per-template `requires_expression` gates classified by
   * `_classifyConditionalGate` in convert-powerset.cjs.
   */
  conditionalEffects?: ConditionalEffect[];
  /** Mutually exclusive power(s) — picking this power prevents picking the listed internalNames */
  excludes?: string[];
}

/** A single state-gated bonus that the InfoPanel renders as a toggle. */
export interface ConditionalEffect {
  /** Stable identifier — derived from the gate (e.g. 'drowning',
   *  'stealthed', 'disintegration'). Used for state persistence and
   *  curated label overrides. */
  id: string;
  /** Human-readable label shown next to the toggle. */
  label: string;
  /**
   * Where the toggle state lives:
   * - `'global'`: caster-state mechanics (Bio Armor adaptations, Hide,
   *   Domination, In Combat) — flipping the toggle on one power flips it
   *   on every power that shares the same `id`.
   * - `'per-power'`: target-state mechanics (drowning, Disintegrating) —
   *   independent state per power.
   *
   * Derived from the underlying gate's `side`: `source` → global,
   * `target` → per-power. Defaults to per-power when unspecified.
   */
  scope?: 'global' | 'per-power';
  /**
   * Mutually-exclusive group key. When present, only one member of the
   * group can be active at a time (Bio Armor's Defensive / Offensive /
   * Rested adaptations, Tidal Power's stack tiers, Dual Blades combo
   * levels). Members without a `group` render as independent checkboxes.
   */
  group?: string;
  /**
   * How this conditional combines with the base power's effects when active:
   * - `'replace'`: the conditional and a base entry are mutually-exclusive
   *   variants of the same mechanic gated on opposite predicates
   *   (Suffocate's -Def: base "if NOT drowning -11%", conditional "if
   *   drowning -14%"). Active conditional's `effects` shallow-merge over
   *   base, and `damage` entries replace the base entries' equivalents.
   * - `'additive'` (default when omitted): the conditional adds its
   *   contribution alongside the base — same effect-key in both means
   *   "two simultaneous instances" (Suffocate's hold: a base mag-3 cast
   *   plus a conditional mag-3 cast when Domination/Stealthed is on).
   *   Currently surfaces only as appended damage entries; effect-key
   *   collisions are left as base-only since multi-instance display
   *   isn't modeled in the InfoPanel yet.
   *
   * Detection happens at convert time: the converter looks for a base
   * template whose `requires_expression` carries the negated form of the
   * conditional's predicate (`! ownPower?`). When found, the conditional
   * is tagged `mode: 'replace'`.
   */
  mode?: 'additive' | 'replace';
  /** Whether the toggle starts on. Defaults to false; mechanics that fire
   *  automatically (e.g. snipe Quick variant when in combat) may default true. */
  defaultActive?: boolean;
  /** Damage entries that apply on top of base damage when active. */
  damage?: ScaledDamageEntry[] | ScaledDamageEntry;
  /** Effect deltas that apply on top of base effects when active. */
  effects?: PowerEffects;
}

// ============================================
// POWERSET DEFINITION
// ============================================

export interface Powerset {
  /** Internal ID (e.g., "blaster/fire-blast") */
  id?: string;
  /** Display name (e.g., "Fire Blast") */
  name: string;
  /** Display name (alternative) */
  displayName?: string;
  /** Archetype this powerset belongs to */
  archetype?: string;
  /** Category (Primary/Secondary, or 'primary'/'secondary') */
  category?: string;
  /** Description of the powerset */
  description: string;
  /** Icon filename */
  icon: string;
  /** Powers in this set */
  powers: Power[];
}

// ============================================
// POWER POOL DEFINITION
// ============================================

export interface PowerPool extends Powerset {
  /** Pool ID (e.g., "speed") */
  id: string;
  /** Prerequisite expression */
  requires?: string;
}

// ============================================
// SELECTED POWER (in a build)
// ============================================

import type { Enhancement } from './enhancement';

export interface SelectedPower extends Power {
  /** The powerset this power belongs to */
  powerSet: string;
  /** Level the power was taken at */
  level: number;
  /** Enhancement slots (null = empty slot) */
  slots: (Enhancement | null)[];
  /** If true, this power cannot be removed by the user (inherent powers) */
  isLocked?: boolean;
  /** Category for inherent powers (fitness, basic, prestige, archetype) */
  inherentCategory?: 'fitness' | 'basic' | 'prestige' | 'archetype';
  /** If true, the power is toggled on and its effects apply to stats (for toggle/buff powers) */
  isActive?: boolean;
  /** For powers that grant mutually exclusive sub-powers (e.g., Adaptation), tracks which one is active */
  activeSubPower?: string;
  /** If true, this power was auto-granted by a parent form power (e.g., Kheldian form sub-powers) and does not count against the 24-power limit */
  isAutoGranted?: boolean;
  /** Name of the parent power that granted this power (e.g., "Bright Nova" for Bright Nova Bolt) */
  grantedByPower?: string;
}
