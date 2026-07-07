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
  /** HC splits some debuffs into two equal halves — one the target's debuff
   *  resistance can reduce, and one that bypasses it (IgnoreResistance). When
   *  true, this slot holds one half and an equal unresistable half also applies;
   *  the InfoPanel renders a second "(unresistable)" row (Flash Arrow -ToHit,
   *  Poison Gas -DMG). Set by the converter's twin pre-scan. */
  unresistable?: boolean;
  /** Additional instances of THIS debuff that the power applies with a different
   *  duration. CoH sometimes stacks the same debuff twice at distinct durations
   *  (EMP Arrow -500% regen at 15s AND 45s; Thunderous Blast -100% recovery at
   *  10s AND 20s) — genuinely separate applications that expire at different
   *  times, so they must not collapse into one summed value. The primary slot
   *  holds the longest-lived instance; each variant is rendered as its own row
   *  with its own duration. Set by the converter's duration-aware accumulate. */
  durationVariants?: { scale: number; duration: number }[];
  /** Per-effect projection of the DSH4 `eToWho` field: `'Self'` marks a debuff
   *  value that actually lands on the CASTER (Granite Armor's -damage/-recharge/
   *  -speed, Rage's crash, Reaction Time's self-slow) and so counts against the
   *  caster's own totals. Absence means the value is a foe/display-only debuff.
   *  This replaces the retired bag-level `selfPenalty` boolean — the converter
   *  classifies each template's target individually, so a foe slow co-located
   *  with a self slow (Rebirth Granite's foe -JumpHeight) no longer rides a
   *  bag-wide flag onto the caster. Read via `isSelfDirectedEffect`. */
  toWho?: 'Self';
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
export function isScaledEffect(value: unknown): value is ScaledEffect {
  return (
    typeof value === 'object' &&
    value !== null &&
    'scale' in value &&
    'table' in value
  );
}

/**
 * A debuff value that lands on the caster (DSH4 `eToWho === 'Self'`). Only the
 * object-shaped ScaledEffect form carries the marker — bare-number debuff slots
 * are foe/display-only by construction (the converter's self-penalty branches
 * always emit an object). Replaces the old bag-level `selfPenalty` gate.
 */
export function isSelfDirectedEffect(value: unknown): boolean {
  return isScaledEffect(value) && value.toWho === 'Self';
}

/**
 * True when a power carries ANY self-directed penalty — a debuff value the
 * caster actually suffers. Scans exactly the slots the converter's self-penalty
 * branches tag (damage/recharge/tohit/accuracy/range debuffs + the per-type
 * `slow` map). This is the power-level projection of the retired `selfPenalty`
 * boolean, now derived from per-effect `toWho` rather than a bag-wide flag.
 */
export function hasSelfDirectedPenalty(effects: PowerEffects | undefined): boolean {
  if (!effects) return false;
  if (
    isSelfDirectedEffect(effects.damageDebuff) ||
    isSelfDirectedEffect(effects.rechargeDebuff) ||
    isSelfDirectedEffect(effects.tohitDebuff) ||
    isSelfDirectedEffect(effects.accuracyDebuff)
  ) {
    return true;
  }
  const slow = effects.slow;
  if (slow && typeof slow === 'object') {
    for (const val of Object.values(slow)) {
      if (isSelfDirectedEffect(val)) return true;
    }
  }
  return false;
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
  /** Binary stealth-stacking group (`stack_key`). Powers sharing a non-null
   *  key mutually suppress — only the largest StealthRadius in the group
   *  applies (e.g. "NictusFX": Stealth, Super Speed, Shinobi-Iri, the cloak
   *  toggles). Null/absent means the radius stacks additively. Consumed by
   *  resolveStealthRadius in character-totals. */
  stackKey?: string | null;
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
  /**
   * The `entities` are mutually-exclusive variants — exactly ONE materializes,
   * not all of them. Soul Extraction summons a single Ghost whose tier
   * (Boss/Lt/Minion) matches the Undead henchman you sacrifice. Display as
   * "Summons 1 of: …" and never sum the variants' counts/damage.
   */
  mutuallyExclusive?: boolean;
  /**
   * Triggered pet entities gated behind a toggle — a SEPARATE PET_ENTITIES entity
   * that only applies when activated (Oil Slick Arrow's `Pets_OilSlickBurn` damage
   * patch, created when the oil is ignited by fire/energy). Off by default; the
   * runtime folds its (enhanceable) damage into the totals when the toggle is on.
   */
  conditionalEntities?: { entity: string; toggleId: string; label: string }[];
  /**
   * Pseudo-pets resolved from `powers` (redirect lists) at convert time, for
   * location pseudo-pets whose entity_def is a generic shell not backed by a
   * PET_ENTITIES record (Storm Cell, Category Five, Freezing Rain, …). Each
   * carries its own synthesized ability list (damage + debuffs). Damage scales
   * off the SUMMONER's archetype, not a fixed pet class.
   * See PSEUDO-PET-POWER-RESOLUTION.md.
   */
  resolvedEntities?: ResolvedPseudoPet[];
}

/** A debuff/mez on a synthesized pseudo-pet ability. */
export interface ResolvedPseudoPetEffect {
  type: string;
  scale?: number;
  table?: string;
  magnitude?: number;
  /** Proc chance the binary gates this effect with (< 1), e.g. the 33% lightning stun. */
  chance?: number;
  /** IgnoreStrength: the player's enhancements/buffs do NOT scale this — show informational/unenhanced. */
  ignoreStrength?: boolean;
  /** Mode-gated: only applies while the power is in its empowered/triggered state
   *  (Storm Cell's lightning effects — "while High Winds is active"). */
  conditional?: boolean;
}

/** One redirect power resolved into a pseudo-pet ability (PetAbility-shaped). */
export interface ResolvedPseudoPetAbility {
  name: string;
  displayName: string;
  type: string;
  damage: { damageType: string; scale: number; table: string }[];
  /** Empowered ("High Winds") replacement for `effects` — the WindSpeed values
   *  (~2× the base Tempest debuffs). The runtime swaps to these when the
   *  "Storm Cell Active" toggle is on. */
  poweredUpEffects?: ResolvedPseudoPetEffect[];
  /** Empowered replacement for `damage` — the high-storm-strength "Strong Storm
   *  Cell Lightning" (StormCell_LightningAura, 1.0 ≈ 2× the base 0.5 aura). The
   *  runtime swaps to these when the "Storm Cell Active" toggle is on, so the
   *  lightning escalates from the base aura to the strong variant players see
   *  in-game once storm strength builds. */
  poweredUpDamage?: { damageType: string; scale: number; table: string }[];
  /** Damage lands at < 100% (storm-strength gated / proc) — kept OUT of the
   *  guaranteed headline DoT and surfaced as a conditional effect instead. */
  conditionalDamage?: boolean;
  /** Cumulative chance the conditional damage lands (0 = storm-strength gated). */
  damageChance?: number;
  effects?: ResolvedPseudoPetEffect[];
  recharge?: number;
  castTime?: number;
  activatePeriod?: number;
  effectArea?: string;
  radius?: number;
  maxTargets?: number;
}

/** A pseudo-pet synthesized from one EntCreate's redirect list. */
export interface ResolvedPseudoPet {
  displayName: string;
  /** Pet lifespan in seconds (the DoT window). */
  duration?: number;
  /** Number of identical copies summoned. */
  count?: number;
  /** Inherits the summoner's enhancements/modifiers (damage off summoner AT). */
  copyCreatorMods: boolean;
  abilities: ResolvedPseudoPetAbility[];
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
  /** Animation root/lock duration in seconds — see `PowerStats.timeToRoot`.
   *  Merged in for display alongside `castTime`; not consumed by calc. */
  timeToRoot?: number;
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
  /** ToHit buff value (unenhanceable — IgnoreStrength; not boosted by ToHit enh / global +ToHit) */
  tohitBuffUnenhanced?: NumberOrScaled;
  /** Accuracy self-buff value (scale or {scale, table}) — e.g. Focused Accuracy */
  accuracyBuff?: NumberOrScaled;
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
  /** Recovery buff value (unenhanceable — IgnoreStrength; not boosted by End Mod / global +recovery) */
  recoveryBuffUnenhanced?: NumberOrScaled;
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
  /** Per-effect stack cap for powers whose `stacksLinear` effects have
   *  DIVERGENT limits, keyed by the same effectKey used in `stacksLinear`.
   *  Psychokinetic Barrier stacks its absorb to 2 but its debuff-resistance to
   *  3, so the slider ranges to `maxStacks` (3) while `stackCaps.absorb = 2`
   *  clamps absorb. A key absent here falls back to `maxStacks`. Only emitted
   *  for keys whose cap is strictly below `maxStacks`. */
  stackCaps?: Record<string, number>;
  /** Seconds between successive stack applications for "ramp" powers that
   *  apply 1 stack per tick within a single cast (e.g. Rebirth's Spirit
   *  Ward: 5×0.10 absorb stacks, one every 3s). Distinguishes this from
   *  recast-stacking (Crab Spider Serum etc.) where stacks come from
   *  recasting the power before previous stacks expire. The InfoPanel uses
   *  this to render "Stacks (every Xs)" on the slider label. */
  stackInterval?: number;

  // === SELF-PENALTY (per-effect `toWho`, see ScaledEffect.toWho) ===
  // The former bag-level `selfPenalty` boolean is retired: whether a debuff
  // lands on the caster is now carried per-value (`toWho:'Self'`), read via
  // `isSelfDirectedEffect` / `hasSelfDirectedPenalty`. This lets a foe debuff
  // co-located with a self debuff stay off the caster's totals.

  // === DEBUFF EFFECTS ===
  /** ToHit debuff value (scale or {scale, table}) */
  tohitDebuff?: NumberOrScaled;
  /** Accuracy debuff value — e.g. Geode's self -Accuracy while petrified */
  accuracyDebuff?: NumberOrScaled;
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
  /**
   * IgnoreStrength run-speed template — contributes to run-speed totals but is
   * NOT boosted by slotted Run Speed enhancements. Used where a power grants two
   * RunningSpeed templates, one enhanceable + one IgnoreStrength (e.g. Sprint and
   * the prestige sprints: +50% enhanceable + +50% unenhanceable). Totals-only,
   * mirroring tohitBuffUnenhanced / regenBuffUnenhanced.
   */
  runSpeedUnenhanced?: MovementEffect;
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
  /** Cast/activation time in seconds. For snipes this is the Normal (not-in-
   *  combat) variant's full interruptible cast — the In-Combat fast form lives
   *  on `quickSnipe`. */
  castTime?: number;
  /** Interruptible channel time in seconds (snipes), already folded into
   *  `castTime`. Enhanceable by Interrupt Reduction; 0/absent otherwise. */
  interruptTime?: number;
  /** Animation root/lock duration in seconds (HC Parse7 field 48b) — the
   *  window during which the character is physically locked in place,
   *  distinct from `interruptTime`. For ordinary snipes this is roughly
   *  `castTime - interruptTime`; for Assassin's Strike from-Hide openers
   *  it's markedly shorter than that gap. Display-only for now — not yet
   *  consumed by attack-chain/DPS timing pending in-game verification of
   *  whether root time (vs full castTime) gates when the next power can
   *  be queued. Absent when equal to castTime (the common case) or unset
   *  (Rebirth/Thunderspy, whose Parse6 layout omits the field). */
  timeToRoot?: number;
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
  /** For `type: 'Heal'` entries flagged IgnoreStrength — the heal is not boosted
   *  by Healing enhancement or global +Heal. */
  ignoreStrength?: boolean;
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
  /**
   * Mez states this power can still be activated through (e.g. Blaster Defiance
   * lets low-tier attacks fire while Held/Slept/Stunned/Terrorized). Values:
   * 'hold' | 'sleep' | 'stun' | 'terror'. Absent when the power can't be cast
   * through any mez (the common case).
   */
  castThroughMez?: Array<'hold' | 'sleep' | 'stun' | 'terror'>;
  /**
   * Mez states that do NOT detoggle this power — it keeps running while you're
   * Held/Slept/Stunned (e.g. mez-protection toggles that must survive the mez
   * they guard against). Values: 'hold' | 'sleep' | 'stun'. Absent when the
   * power detoggles normally on any mez (the common case).
   */
  toggleIgnoreMez?: Array<'hold' | 'sleep' | 'stun'>;
  /**
   * ChainTarget — the raw RPN weighting that decides which target a chain power
   * jumps to next (bin field 43b). Electrical Affinity circuits use it to pick
   * the neediest ally (`kHitPoints%` / `kEndurance%` priority) or the nearest
   * one (`prevdistance`). Carried verbatim from the binary; the Info panel
   * humanizes the known patterns. Absent on non-chain powers.
   */
  chainTargetExpression?: string;
  /**
   * MaxTargetsExpr — a computed target-cap RPN (bin field 38) that overrides the
   * static `stats.maxTargets` when its condition holds (e.g. the circuits' cap
   * grows while the Static buff is stacked; a Tanker Gauntlet attack's cap).
   * Absent unless the cap is conditional.
   */
  maxTargetsExpression?: string;
  /**
   * Attributes of this power that NO strength applies to — neither slotted
   * enhancement nor global buffs (e.g. 'RechargeTime' on Rune of Protection /
   * the armor T9s means Hasten and recharge set bonuses do NOT speed them up;
   * 'Range' on most melee attacks). Server-side data not present in the client
   * bin — sourced from the `raw defs/` oracle by the converter, HC only.
   * Absent on the vast majority of powers.
   */
  strengthsDisallowed?: string[];
  /**
   * Attributes for which only GLOBAL strength is ignored — slotted enhancement
   * still applies (e.g. 'RechargeTime' on Kuji-In Rin: recharge IOs work,
   * Hasten/set bonuses don't). Same sourcing/caveats as `strengthsDisallowed`.
   */
  globalStrengthsDisallowed?: string[];
  /** Prerequisite power(s) - logical expression */
  requires?: string;
  /**
   * Game "modes" this power ACTIVATES — combat-state flags set by a `Set_Mode`
   * effect (e.g. Granite Armor sets `Granite_Mode`; Momentum sets `FastMode`;
   * Bright Nova sets `Peacebringer_Blaster_Mode`; Swap Ammo sets `LethalAmmo`).
   * When this power is active in a build, these modes are "live" and drive
   * `modesSuspended` / `modesRequired` on other powers. Raw mode ids; noise
   * (`Disable_All`) stripped. Absent on the vast majority of powers.
   */
  setsModes?: string[];
  /**
   * Modes that SUSPEND this power's own effect contribution while live. The
   * other Stone Armor toggles carry `['Granite_Mode']` (Granite suspends them);
   * pool/travel toggles carry the `Suppress_*` markers Granite/forms set. When
   * an active power in the build `setsModes` an intersecting mode, the totals
   * calc drops this power's direct effects (set bonuses still apply — the toggle
   * is still running) and the UI marks it "Suspended by <setter>". Raw mode ids.
   */
  modesSuspended?: string[];
  /**
   * Modes this power needs to be USABLE — Titan `FastMode` (Momentum) attacks,
   * Kheldian form attacks, Domination-only powers, travel-toggle-gated powers.
   * Annotation only: a build planner always slots these, so they are NOT greyed
   * out; the InfoPanel shows a "Requires: <mode>" note. Raw mode ids.
   */
  modesRequired?: string[];
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
   * Assassin's Strike from-Hide damage multiplier, expressed as a bonus over the
   * displayed (not-hidden) base — e.g. 2.174 = +217%. Replaces the generic
   * assassination crit (+100%) when AS is fired from Hide. Derived from the
   * Hidden redirect branch (visible Melee + Assassination InherentDamage) by
   * `extractAssassinStrikeDamage`; the ratio is enhancement-invariant so it
   * applies directly to the enhanced base damage. PvE.
   */
  fromHideBonus?: number;
  /**
   * Assassin's Strike's fast mid-combat (Quick) cast time in seconds. The base
   * `stats.castTime` is the slow interruptible from-Hide animation (~3s); fired
   * mid-combat AS is much faster (~0.67–1.77s by set). The attack-chain builder
   * defaults AS to this fast form and reserves the slow base cast for the
   * from-Hide form (opener / post-Placate). Absent on single-form AS (Rebirth).
   */
  midCombatCast?: number;
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
  /**
   * Procs and unique mechanic surfaces — chance-based effects that don't
   * fire on every cast. Renders in the InfoPanel's SPECIAL section as
   * "+X% chance to <description>" rows. Two flavors:
   *
   * - **grant**: a power-grant proc (Suffocate's "32.57% chance to grant
   *   Drowning on target") — usually a `Null`-attrib chance template
   *   linked to a sibling `conditionalEffects` entry by power-name.
   * - **effect-proc**: a chance-based effect like Water Burst's "33%
   *   chance Knockback" — a non-`Null` attrib template with `chance < 1`.
   */
  specialEffects?: SpecialEffect[];
  /** Damage-over-time procs the power GRANTS via a hidden `Temporary_Powers`
   *  power rather than carrying inline (Molten Embrace's Fire DoT, Stalker Hidden
   *  Flame, Envenomed Blades, Bio Offensive Adaptation, Plant Toxins). The grant
   *  hop is resolved at convert time. */
  grantedDamageProcs?: GrantedDamageProc[];
  /** Mutually exclusive power(s) — picking this power prevents picking the listed internalNames */
  excludes?: string[];
}

/**
 * A damage-over-time proc a power GRANTS through a hidden `Temporary_Powers`
 * power. The damage lives in the granted power (e.g.
 * `Temporary_Powers.Temporary_Powers.Molten_Embrace_Proc`), not inline on the
 * granting power, so it was invisible to the planner until resolved at convert
 * time. Surfaced informationally on the granting power — it procs off the
 * player's OWN attacks (at `tickChance`), so it isn't folded into the granting
 * power's own attack DPS.
 */
export interface GrantedDamageProc {
  /** Internal name of the granted proc power. */
  name: string;
  displayName: string;
  /** Damage components — scale/table resolve against the summoner's AT, like any attack. */
  damage: { damageType: string; scale: number; table: string }[];
  /** The player's damage enhancements/buffs scale this DoT (false ⇒ `IgnoreStrength`).
   *  The I28P3 Molten Embrace change is exactly flipping this true. */
  enhanceable: boolean;
  /** Per-application proc chance (< 1) — the "chance to inflict … over time". */
  tickChance?: number;
  /** DoT tick interval in seconds (`application_period`). */
  period?: number;
  /** Total DoT duration in seconds. */
  duration?: number;
}

/** A proc/conditional-grant entry for the InfoPanel SPECIAL section. */
export interface SpecialEffect {
  /**
   * - `'grant'`: a power-presence grant proc (e.g. "X% chance to grant
   *   Drowning on target"). Usually backed by a `Null`-attrib chance
   *   template paired with a `conditionalEffects` entry.
   * - `'effect-proc'`: a chance-based simple effect (e.g. Knockback).
   */
  kind: 'grant' | 'effect-proc';
  /** Chance per cast, 0..1. */
  chance: number;
  /** User-facing label fragment. For 'grant', usually a power name like
   *  "Drowning"; for 'effect-proc', the effect name like "Knockback". */
  label: string;
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
  /**
   * Number of trailing slots in `slots` that were auto-granted by the game
   * (e.g. Fitness Health/Stamina inherent slot grants). These don't count
   * against the user's 67-slot budget.
   */
  inherentSlotCount?: number;
}
