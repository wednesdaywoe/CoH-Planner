/**
 * Archetype Inherent Power Calculations
 *
 * Contains formulas for calculating archetype-specific inherent bonuses
 * like Blaster Defiance, Controller Containment, etc.
 */

import type { PowerEffects, EffectArea } from '@/types';

// ============================================
// BLASTER - DEFIANCE
// ============================================

/**
 * Defiance grants a stacking damage bonus when a Blaster attacks.
 * The bonus amount and duration depend on the power used.
 *
 * Formulas from Castle (developer):
 * - Duration = 7.5 + Activation Time
 * - Damage Bonus = 6.6% * Activation Time / Area Modifier
 *
 * Area Modifier:
 * - Single Target: 1
 * - Circular AoE: 1 + (0.15 * radius)
 * - Cone: 1 + (0.15 * radius) - (0.0003667 * radius * (360 - arc))
 */

export interface DefianceInfo {
  /** Damage bonus percentage per use */
  damageBonus: number;
  /** Duration of the buff in seconds */
  duration: number;
}

/**
 * Calculate the Area Modifier for Defiance calculations
 */
function calculateAreaModifier(
  effectArea: EffectArea | undefined,
  radius: number,
  arcDegrees: number
): number {
  if (!effectArea || effectArea === 'SingleTarget') {
    return 1;
  }

  if (effectArea === 'AoE' || effectArea === 'Location') {
    // Circular AoE
    return 1 + 0.15 * radius;
  }

  if (effectArea === 'Cone') {
    // Cone formula
    return 1 + 0.15 * radius - 0.0003667 * radius * (360 - arcDegrees);
  }

  // Chain or other - treat as single target
  return 1;
}

/**
 * Calculate Defiance bonus for a power
 *
 * @param effects - The power's effects object
 * @param effectArea - The power's effect area type
 * @returns Defiance info with damage bonus percentage and duration, or null if not applicable
 */
export function calculateDefiance(
  effects: PowerEffects | undefined,
  effectArea?: EffectArea
): DefianceInfo | null {
  if (!effects) return null;

  // Get cast/activation time
  const castTime = effects.castTime ?? 0;

  // No defiance bonus for instant powers
  if (castTime <= 0) return null;

  // Get radius (default 0 for single target)
  const radius = effects.radius ?? 0;

  // Get arc in degrees (data stores in radians)
  const arcRadians = effects.arc ?? 0;
  const arcDegrees = arcRadians > 0 ? arcRadians * (180 / Math.PI) : 360;

  // Calculate area modifier
  const areaModifier = calculateAreaModifier(effectArea, radius, arcDegrees);

  // Calculate damage bonus: 6.6% * castTime / areaModifier
  const damageBonus = (6.6 * castTime) / areaModifier;

  // Calculate duration: 7.5 + castTime
  const duration = 7.5 + castTime;

  return {
    damageBonus: Math.round(damageBonus * 100) / 100, // Round to 2 decimal places
    duration: Math.round(duration * 100) / 100,
  };
}

/**
 * Check if a power is a Blaster primary or secondary power
 * (Defiance only applies to these)
 */
export function isBlasterAttackPower(powersetId: string): boolean {
  return powersetId.startsWith('blaster/');
}

// ============================================
// FUTURE: Other archetype inherents
// ============================================

// Controller - Containment: Double damage vs held/immob/slept/confused targets
// Scrapper - Critical Hits: % chance for double damage
// Tanker - Gauntlet: AoE taunt on attacks
// Brute - Fury: Damage builds from attacking/being attacked
// Corruptor - Scourge: Extra damage as target HP decreases
// Mastermind - Supremacy: Pets get damage/accuracy buff when near MM
// Stalker - Assassin's Focus/Hide: Stealth + critical mechanics
// Defender - Vigilance: Endurance discount (team) / damage buff (solo)
// Sentinel - Opportunity: Build meter for offensive/defensive debuffs

// ============================================
// DOMINATOR - DOMINATION
// ============================================

/**
 * Domination grants enhanced control effects when activated.
 *
 * When Domination is active:
 * - Mez magnitude is doubled (2x)
 * - Mez duration is increased by 50% (1.5x)
 * - Provides mez protection (Knockback, Knockup, Repel, Stun, Hold, Sleep, Immobilize, Fear, Confuse)
 * - Full endurance recovery on activation
 *
 * Duration: 90 seconds
 * Recharge: 200 seconds
 */

export interface DominationInfo {
  /** Mez magnitude multiplier when active */
  magnitudeMultiplier: number;
  /** Mez duration multiplier when active */
  durationMultiplier: number;
  /** Duration of Domination in seconds */
  activeDuration: number;
  /** Base recharge time in seconds */
  rechargeTime: number;
}

/** Mez types that Domination provides protection against */
export const DOMINATION_MEZ_PROTECTION = [
  'Knockback',
  'Knockup',
  'Repel',
  'Stun',
  'Hold',
  'Sleep',
  'Immobilize',
  'Fear',
  'Confuse',
] as const;

export type DominationMezType = (typeof DOMINATION_MEZ_PROTECTION)[number];

/**
 * Get Domination stats (constant values)
 */
export function getDominationInfo(): DominationInfo {
  return {
    magnitudeMultiplier: 2.0,
    durationMultiplier: 1.5,
    activeDuration: 90,
    rechargeTime: 200,
  };
}

/**
 * Calculate enhanced mez magnitude when Domination is active
 * @param baseMagnitude - The base mez magnitude
 * @returns The doubled magnitude
 */
export function calculateDominationMagnitude(baseMagnitude: number): number {
  return baseMagnitude * 2;
}

/**
 * Calculate enhanced mez duration when Domination is active
 * @param baseDuration - The base mez duration in seconds
 * @returns The duration with 50% bonus
 */
export function calculateDominationDuration(baseDuration: number): number {
  return baseDuration * 1.5;
}

/**
 * Check if a power is a Dominator primary or secondary power
 * (Domination mez bonuses only apply to these)
 */
export function isDominatorControlPower(powersetId: string): boolean {
  return powersetId.startsWith('dominator/');
}

// ============================================
// CORRUPTOR - SCOURGE
// ============================================

/**
 * Scourge grants a chance for bonus damage based on enemy HP.
 *
 * Mechanics:
 * - 2.5% chance for every 1% of enemy HP below 50%
 * - At 50%+ HP: 0% chance
 * - At 40% HP: 25% chance
 * - At 10% HP or below: 100% chance (guaranteed)
 *
 * Statistical average: 30% damage bonus (applied as a multiplier AFTER damage buffs)
 *
 * The damage bonus is applied as a multiplier, not added to damage buffs:
 * - With buffs: BaseDamage * (1 + EnhBonus + DamageBuffs) * (1 + ScourgeBonus)
 * - NOT: BaseDamage * (1 + EnhBonus + DamageBuffs + ScourgeBonus)
 */

export interface ScourgeInfo {
  /** Average damage multiplier (as decimal, e.g., 0.30 = 30%) */
  averageDamageBonus: number;
  /** Chance formula description */
  chanceFormula: string;
  /** HP threshold where Scourge starts */
  hpThreshold: number;
  /** HP threshold where Scourge is guaranteed */
  guaranteedThreshold: number;
}

/**
 * Get Scourge stats (constant values)
 */
export function getScourgeInfo(): ScourgeInfo {
  return {
    averageDamageBonus: 0.30, // 30% average
    chanceFormula: '2.5% per 1% HP below 50%',
    hpThreshold: 50, // Starts at 50% HP
    guaranteedThreshold: 10, // Guaranteed at 10% HP or below
  };
}

/**
 * Calculate Scourge chance at a given enemy HP percentage
 * @param enemyHpPercent - Enemy's current HP as percentage (0-100)
 * @returns Chance to Scourge (0-1)
 */
export function calculateScourgeChance(enemyHpPercent: number): number {
  if (enemyHpPercent >= 50) return 0;
  if (enemyHpPercent <= 10) return 1;

  // 2.5% chance per 1% below 50%
  const percentBelow50 = 50 - enemyHpPercent;
  return Math.min(1, percentBelow50 * 0.025);
}

/**
 * Calculate damage with Scourge average bonus applied
 * Scourge is a multiplier applied AFTER damage buffs
 * @param baseDamage - The damage after enhancements and buffs
 * @returns Damage with average Scourge bonus applied
 */
export function calculateScourgeDamage(baseDamage: number): number {
  const scourgeInfo = getScourgeInfo();
  return baseDamage * (1 + scourgeInfo.averageDamageBonus);
}

/**
 * Check if a power is a Corruptor attack power
 * (Scourge applies to all Corruptor attacks)
 */
export function isCorruptorAttackPower(powersetId: string): boolean {
  return powersetId.startsWith('corruptor/');
}

// ============================================
// BRUTE - FURY
// ============================================

/**
 * Fury grants a damage bonus based on the Fury meter level.
 *
 * Mechanics:
 * - Fury meter ranges from 0-100
 * - Damage bonus = Fury × 2% (so 100 Fury = 200% damage buff)
 * - Fury builds from attacking and being attacked
 * - Fury decays over time when not in combat
 *
 * The damage bonus is applied as an additive buff (like other damage buffs):
 * - With buffs: BaseDamage * (1 + EnhBonus + DamageBuffs + FuryBonus)
 */

export interface FuryInfo {
  /** Minimum fury level */
  minFury: number;
  /** Maximum fury level */
  maxFury: number;
  /** Damage bonus per point of fury (as decimal) */
  damagePerFury: number;
}

/**
 * Get Fury stats (constant values)
 */
export function getFuryInfo(): FuryInfo {
  return {
    minFury: 0,
    maxFury: 100,
    damagePerFury: 0.02, // 2% per fury point
  };
}

/**
 * Calculate damage bonus from Fury
 * @param furyLevel - Current fury level (0-100)
 * @returns Damage bonus as decimal (e.g., 2.0 = 200% bonus)
 */
export function calculateFuryDamageBonus(furyLevel: number): number {
  const furyInfo = getFuryInfo();
  const clampedFury = Math.max(furyInfo.minFury, Math.min(furyInfo.maxFury, furyLevel));
  return clampedFury * furyInfo.damagePerFury;
}

/**
 * Calculate damage with Fury bonus applied
 * Fury is an additive damage buff
 * @param baseDamage - The base damage before fury
 * @param furyLevel - Current fury level (0-100)
 * @returns Damage with Fury bonus applied
 */
export function calculateFuryDamage(baseDamage: number, furyLevel: number): number {
  const furyBonus = calculateFuryDamageBonus(furyLevel);
  return baseDamage * (1 + furyBonus);
}

/**
 * Check if a power is a Brute attack power
 * (Fury applies to all Brute attacks)
 */
export function isBruteAttackPower(powersetId: string): boolean {
  return powersetId.startsWith('brute/');
}

// ============================================
// MASTERMIND - SUPREMACY
// ============================================

/**
 * Supremacy grants buffs to Mastermind henchmen when they are near the Mastermind.
 *
 * Mechanics:
 * - +25% Damage to henchmen within 60ft radius
 * - +10% ToHit to henchmen within 60ft radius
 * - Affects all henchmen from all tiers
 *
 * Bodyguard Mode:
 * - When henchmen are set to Defensive/Follow stance
 * - Damage to Mastermind is split: 66% to MM, 33% spread among henchmen
 * - Effectively reduces incoming damage by 33%
 */

export interface SupremacyInfo {
  /** Damage bonus for henchmen (as decimal, e.g., 0.25 = 25%) */
  damageBonus: number;
  /** ToHit bonus for henchmen (as decimal, e.g., 0.10 = 10%) */
  toHitBonus: number;
  /** Radius of Supremacy effect in feet */
  radius: number;
}

export interface BodyguardInfo {
  /** Percentage of damage taken by Mastermind */
  mastermindDamageShare: number;
  /** Percentage of damage shared among henchmen */
  henchmenDamageShare: number;
  /** Effective damage reduction for Mastermind */
  effectiveDamageReduction: number;
}

/**
 * Get Supremacy stats (constant values)
 */
export function getSupremacyInfo(): SupremacyInfo {
  return {
    damageBonus: 0.25, // +25% damage
    toHitBonus: 0.10, // +10% ToHit
    radius: 60, // 60 feet
  };
}

/**
 * Get Bodyguard Mode stats (constant values)
 */
export function getBodyguardInfo(): BodyguardInfo {
  return {
    mastermindDamageShare: 0.66, // 66% to Mastermind
    henchmenDamageShare: 0.33, // 33% to henchmen
    effectiveDamageReduction: 0.33, // 33% effective reduction
  };
}

/**
 * Calculate henchman damage with Supremacy bonus
 * @param baseDamage - Henchman's base damage
 * @returns Damage with Supremacy bonus applied
 */
export function calculateSupremacyDamage(baseDamage: number): number {
  const supremacyInfo = getSupremacyInfo();
  return baseDamage * (1 + supremacyInfo.damageBonus);
}

/**
 * Calculate henchman ToHit with Supremacy bonus
 * @param baseToHit - Henchman's base ToHit (as decimal)
 * @returns ToHit with Supremacy bonus applied
 */
export function calculateSupremacyToHit(baseToHit: number): number {
  const supremacyInfo = getSupremacyInfo();
  return baseToHit + supremacyInfo.toHitBonus;
}

/**
 * Calculate effective damage to Mastermind when in Bodyguard Mode
 * @param incomingDamage - The raw incoming damage
 * @param henchmenCount - Number of henchmen in Bodyguard Mode (0-6)
 * @returns Object with damage to MM and damage per henchman
 */
export function calculateBodyguardDamage(
  incomingDamage: number,
  henchmenCount: number
): { mastermindDamage: number; damagePerHenchman: number } {
  if (henchmenCount <= 0) {
    // No henchmen, MM takes full damage
    return { mastermindDamage: incomingDamage, damagePerHenchman: 0 };
  }

  const bodyguardInfo = getBodyguardInfo();
  const mastermindDamage = incomingDamage * bodyguardInfo.mastermindDamageShare;
  const totalHenchmenDamage = incomingDamage * bodyguardInfo.henchmenDamageShare;
  const damagePerHenchman = totalHenchmenDamage / henchmenCount;

  return { mastermindDamage, damagePerHenchman };
}

/**
 * Check if a power is a Mastermind power
 */
export function isMastermindPower(powersetId: string): boolean {
  return powersetId.startsWith('mastermind/');
}

// ============================================
// DEFENDER - VIGILANCE
// ============================================

/**
 * Vigilance provides two benefits to Defenders:
 *
 * 1. Endurance Discount: As teammates lose health, the Defender gains
 *    reduced endurance costs. The more injured teammates are, the greater
 *    the discount. (Not modeled in this planner)
 *
 * 2. Damage Bonus: Based on team size and level. Smaller teams = more damage.
 *    - Solo: 6% at level 1, scaling to 30% at level 20+
 *    - 1 teammate: 4% at level 1, scaling to 20% at level 20+
 *    - 2 teammates: 2% at level 1, scaling to 10% at level 20+
 *    - 3+ teammates: 0%
 */

export interface VigilanceInfo {
  /** Maximum damage bonus when solo at max level */
  maxSoloDamageBonus: number;
  /** Maximum damage bonus with 1 teammate at max level */
  maxOneTeammateDamageBonus: number;
  /** Maximum damage bonus with 2 teammates at max level */
  maxTwoTeammatesDamageBonus: number;
  /** Level at which max bonus is reached */
  maxBonusLevel: number;
}

/**
 * Vigilance damage bonus table by level
 * Index = level (1-20+), values = [solo, 1 teammate, 2 teammates]
 */
const VIGILANCE_DAMAGE_TABLE: Record<number, [number, number, number]> = {
  1: [0.060, 0.040, 0.020],
  2: [0.063, 0.042, 0.021],
  3: [0.069, 0.046, 0.023],
  4: [0.075, 0.050, 0.025],
  5: [0.081, 0.054, 0.027],
  6: [0.090, 0.060, 0.030],
  7: [0.105, 0.070, 0.035],
  8: [0.120, 0.080, 0.040],
  9: [0.135, 0.090, 0.045],
  10: [0.150, 0.100, 0.050],
  11: [0.165, 0.110, 0.055],
  12: [0.180, 0.120, 0.060],
  13: [0.195, 0.130, 0.065],
  14: [0.210, 0.140, 0.070],
  15: [0.225, 0.150, 0.075],
  16: [0.240, 0.160, 0.080],
  17: [0.255, 0.170, 0.085],
  18: [0.270, 0.180, 0.090],
  19: [0.285, 0.190, 0.095],
  20: [0.300, 0.200, 0.100],
};

/**
 * Get Vigilance stats (constant values)
 */
export function getVigilanceInfo(): VigilanceInfo {
  return {
    maxSoloDamageBonus: 0.30, // 30% at level 20+ solo
    maxOneTeammateDamageBonus: 0.20, // 20% at level 20+ with 1 teammate
    maxTwoTeammatesDamageBonus: 0.10, // 10% at level 20+ with 2 teammates
    maxBonusLevel: 20, // Level at which max bonus is reached
  };
}

/**
 * Calculate Vigilance damage bonus based on level and team size
 * @param level - Character level (1-50)
 * @param teammateCount - Number of teammates (0 = solo, 1, 2, 3+)
 * @returns Damage bonus as decimal (e.g., 0.30 = 30%)
 */
export function calculateVigilanceDamageBonus(level: number, teammateCount: number): number {
  // 3+ teammates = no bonus
  if (teammateCount >= 3) return 0;

  // Clamp level to valid range
  const effectiveLevel = Math.min(20, Math.max(1, level));

  // Get the damage values for this level
  const levelData = VIGILANCE_DAMAGE_TABLE[effectiveLevel];
  if (!levelData) return 0;

  // Return based on teammate count (0 = solo, 1, 2)
  const index = Math.min(teammateCount, 2);
  return levelData[index];
}

/**
 * Calculate damage with Vigilance bonus applied
 * Vigilance is an additive damage buff
 * @param baseDamage - The base damage before vigilance
 * @param level - Character level (1-50)
 * @param teammateCount - Number of teammates (0 = solo)
 * @returns Damage with Vigilance bonus applied
 */
export function calculateVigilanceDamage(baseDamage: number, level: number, teammateCount: number): number {
  const vigilanceBonus = calculateVigilanceDamageBonus(level, teammateCount);
  return baseDamage * (1 + vigilanceBonus);
}

/**
 * Check if a power is a Defender power
 */
export function isDefenderPower(powersetId: string): boolean {
  return powersetId.startsWith('defender/');
}

// ============================================
// SENTINEL - OPPORTUNITY
// ============================================

/**
 * Opportunity is a debuff applied to enemies when the Sentinel activates their inherent.
 *
 * The Sentinel builds an Opportunity meter by attacking. When the meter is full,
 * their next single-target primary attack will apply either Offensive or Defensive
 * Opportunity to the target.
 *
 * Offensive Opportunity (T1 attack): Debuffs applied to enemy
 * - -11.25% Defense
 * - -15% Resistance to all damage types (Smashing, Lethal, Fire, Cold, Energy, Negative, Psionic, Toxic)
 * - -15% Resistance to mez effects (Confusion, Fear, Hold, Immobilize, Sleep, Stun)
 * - -15% Resistance to Recovery, Regeneration, and ToHit debuffs
 * - -150ft Stealth (removes enemy stealth)
 *
 * Defensive Opportunity (T2 attack): Same debuffs plus heal to Sentinel
 */

export interface OpportunityInfo {
  /** Defense debuff applied to enemy */
  defenseDebuff: number;
  /** Resistance debuff to all damage types */
  resistanceDebuff: number;
  /** Resistance debuff to mez effects (longer durations) */
  mezResistanceDebuff: number;
  /** Resistance debuff to recovery/regen/tohit debuffs */
  secondaryResistanceDebuff: number;
  /** Stealth reduction in feet */
  stealthReduction: number;
  /** Damage types affected by resistance debuff */
  affectedDamageTypes: string[];
  /** Mez types affected by mez resistance debuff */
  affectedMezTypes: string[];
}

/**
 * Get Opportunity stats (constant values)
 */
export function getOpportunityInfo(): OpportunityInfo {
  return {
    defenseDebuff: 0.1125, // -11.25% defense
    resistanceDebuff: 0.15, // -15% resistance to damage
    mezResistanceDebuff: 0.15, // -15% mez resistance (longer mez durations)
    secondaryResistanceDebuff: 0.15, // -15% to recovery/regen/tohit debuff resistance
    stealthReduction: 150, // -150ft stealth
    affectedDamageTypes: ['Smashing', 'Lethal', 'Fire', 'Cold', 'Energy', 'Negative', 'Psionic', 'Toxic'],
    affectedMezTypes: ['Confusion', 'Fear', 'Hold', 'Immobilize', 'Sleep', 'Stun'],
  };
}

/**
 * Check if a power is a Sentinel power
 */
export function isSentinelPower(powersetId: string): boolean {
  return powersetId.startsWith('sentinel/');
}

// ============================================
// SCRAPPER - CRITICAL HITS
// ============================================

/**
 * Critical Hits grant Scrappers a chance to deal double damage.
 *
 * Mechanics:
 * - 5% chance vs players, pets, and critters of Minion rank and below
 * - 10% chance vs critters above Minion rank (Lieutenants, Bosses, etc.)
 * - Critical hits deal double damage (100% extra damage)
 *
 * Statistical averages:
 * - vs Minions: 5% × 100% = 5% average damage bonus
 * - vs Higher: 10% × 100% = 10% average damage bonus
 *
 * The damage bonus is applied as a multiplier AFTER damage buffs (like Scourge):
 * - With buffs: BaseDamage * (1 + EnhBonus + DamageBuffs) * (1 + CritBonus)
 */

export type CriticalHitTarget = 'minion' | 'higher';

export interface CriticalHitInfo {
  /** Critical hit chance vs minions and below */
  chanceVsMinions: number;
  /** Critical hit chance vs lieutenants, bosses, etc. */
  chanceVsHigher: number;
  /** Damage multiplier on critical (2.0 = double damage) */
  damageMultiplier: number;
  /** Average damage bonus vs minions (chance × extra damage) */
  averageBonusVsMinions: number;
  /** Average damage bonus vs higher rank targets */
  averageBonusVsHigher: number;
}

/**
 * Get Critical Hit stats (constant values)
 */
export function getCriticalHitInfo(): CriticalHitInfo {
  return {
    chanceVsMinions: 0.05, // 5% chance vs minions
    chanceVsHigher: 0.10, // 10% chance vs higher
    damageMultiplier: 2.0, // Double damage
    averageBonusVsMinions: 0.05, // 5% average (5% × 100%)
    averageBonusVsHigher: 0.10, // 10% average (10% × 100%)
  };
}

/**
 * Calculate critical hit chance based on target type
 * @param targetType - 'minion' for minions and below, 'higher' for lieutenants/bosses
 * @returns Critical hit chance (0-1)
 */
export function calculateCriticalHitChance(targetType: CriticalHitTarget): number {
  const critInfo = getCriticalHitInfo();
  return targetType === 'minion' ? critInfo.chanceVsMinions : critInfo.chanceVsHigher;
}

/**
 * Calculate damage with average Critical Hit bonus applied
 * Critical Hits are a multiplier applied AFTER damage buffs (like Scourge)
 * @param baseDamage - The damage after enhancements and buffs
 * @param targetType - 'minion' for minions and below, 'higher' for lieutenants/bosses
 * @returns Damage with average Critical Hit bonus applied
 */
export function calculateCriticalHitDamage(baseDamage: number, targetType: CriticalHitTarget): number {
  const critInfo = getCriticalHitInfo();
  const averageBonus = targetType === 'minion' ? critInfo.averageBonusVsMinions : critInfo.averageBonusVsHigher;
  return baseDamage * (1 + averageBonus);
}

/**
 * Check if a power is a Scrapper attack power
 * (Critical Hits apply to all Scrapper attacks)
 */
export function isScrapperAttackPower(powersetId: string): boolean {
  return powersetId.startsWith('scrapper/');
}

// ============================================
// STALKER - ASSASSINATION
// ============================================

/**
 * Assassination grants Stalkers enhanced critical hit mechanics.
 *
 * Mechanics:
 * - From Hide: Always critical (100% chance, double damage)
 * - Outside Hide: 10% base critical chance vs non-player enemies
 * - Team Bonus: +3% critical chance per nearby teammate (up to +21% with 7 teammates)
 * - Assassin's Focus: Primary attacks can grant stacks that boost Assassin's Strike crit chance
 *   - Each stack: +33.3% crit chance for Assassin's Strike (outside hide)
 *   - Max 3 stacks = guaranteed crit on Assassin's Strike
 *   - Stacks last 10 seconds
 *
 * Critical hits deal double damage (100% extra damage).
 * The damage bonus is applied as a multiplier AFTER damage buffs (like Scourge).
 */

export interface AssassinationInfo {
  /** Critical hit chance when hidden (always 100%) */
  hiddenCritChance: number;
  /** Base critical hit chance outside of hide */
  baseCritChance: number;
  /** Additional crit chance per nearby teammate */
  critChancePerTeammate: number;
  /** Maximum teammates that count for bonus */
  maxTeammates: number;
  /** Damage multiplier on critical (2.0 = double damage) */
  damageMultiplier: number;
  /** Assassin's Focus crit bonus per stack */
  assassinsFocusPerStack: number;
  /** Maximum Assassin's Focus stacks */
  maxAssassinsFocusStacks: number;
  /** Assassin's Focus duration in seconds */
  assassinsFocusDuration: number;
}

/**
 * Get Assassination stats (constant values)
 */
export function getAssassinationInfo(): AssassinationInfo {
  return {
    hiddenCritChance: 1.0, // 100% from hide
    baseCritChance: 0.10, // 10% base outside hide
    critChancePerTeammate: 0.03, // +3% per teammate
    maxTeammates: 7, // Max team size
    damageMultiplier: 2.0, // Double damage on crit
    assassinsFocusPerStack: 0.333, // ~33.3% per stack
    maxAssassinsFocusStacks: 3, // 3 stacks = 100%
    assassinsFocusDuration: 10, // 10 second duration
  };
}

/**
 * Calculate critical hit chance for Stalker attacks
 * @param isHidden - Whether the Stalker is attacking from Hide
 * @param teammateCount - Number of nearby teammates (0-7)
 * @returns Critical hit chance (0-1)
 */
export function calculateAssassinationCritChance(isHidden: boolean, teammateCount: number): number {
  if (isHidden) {
    return 1.0; // 100% from hide
  }

  const info = getAssassinationInfo();
  const clampedTeammates = Math.min(info.maxTeammates, Math.max(0, teammateCount));
  const teamBonus = clampedTeammates * info.critChancePerTeammate;

  return Math.min(1.0, info.baseCritChance + teamBonus);
}

/**
 * Calculate average damage bonus from Assassination
 * @param isHidden - Whether attacking from Hide
 * @param teammateCount - Number of nearby teammates
 * @returns Average damage bonus as decimal (crit chance × 100% extra damage)
 */
export function calculateAssassinationDamageBonus(isHidden: boolean, teammateCount: number): number {
  const critChance = calculateAssassinationCritChance(isHidden, teammateCount);
  // Since crits do double damage (100% extra), average bonus = critChance × 100%
  return critChance;
}

/**
 * Calculate damage with average Assassination bonus applied
 * @param baseDamage - The damage after enhancements and buffs
 * @param isHidden - Whether attacking from Hide
 * @param teammateCount - Number of nearby teammates
 * @returns Damage with average Assassination bonus applied
 */
export function calculateAssassinationDamage(
  baseDamage: number,
  isHidden: boolean,
  teammateCount: number
): number {
  const avgBonus = calculateAssassinationDamageBonus(isHidden, teammateCount);
  return baseDamage * (1 + avgBonus);
}

/**
 * Check if a power is a Stalker attack power
 * (Assassination applies to all Stalker attacks)
 */
export function isStalkerAttackPower(powersetId: string): boolean {
  return powersetId.startsWith('stalker/');
}

// ============================================
// TANKER - GAUNTLET
// ============================================

/**
 * Gauntlet ("PunchVoke") enhances Tanker attacks with taunt mechanics and AoE bonuses.
 *
 * Mechanics:
 * - AoE attacks taunt all enemies they affect
 * - Single-target attacks taunt the target + up to 4 nearby enemies
 * - Reduced chance vs Giant Monsters, worse in PvP
 * - As of Issue 26 Page 4: +50% radius/range for AoE, +50% arc for cones
 * - Melee PBAoE can hit bonus targets for 1/3 effect
 *
 * Brutes have a smaller version ("PokeVoke"):
 * - Only taunts the single target hit
 * - Does not apply in PvP
 */

export interface GauntletInfo {
  /** AoE radius bonus (as decimal, 0.50 = 50%) */
  aoeRadiusBonus: number;
  /** Cone arc bonus (as decimal, 0.50 = 50%) */
  coneArcBonus: number;
  /** Maximum additional targets taunted by single-target attacks */
  singleTargetTauntSplash: number;
  /** Bonus target damage multiplier for PBAoE (0.33 = 1/3 damage) */
  bonusTargetDamageMultiplier: number;
}

/**
 * Get Gauntlet stats (constant values)
 */
export function getGauntletInfo(): GauntletInfo {
  return {
    aoeRadiusBonus: 0.50, // +50% radius/range
    coneArcBonus: 0.50, // +50% arc
    singleTargetTauntSplash: 4, // Taunts up to 4 additional enemies
    bonusTargetDamageMultiplier: 0.33, // Bonus targets take 1/3 damage
  };
}

/**
 * Calculate enhanced AoE radius with Gauntlet bonus
 * @param baseRadius - The base radius in feet
 * @returns Enhanced radius with Gauntlet bonus
 */
export function calculateGauntletRadius(baseRadius: number): number {
  const gauntletInfo = getGauntletInfo();
  return baseRadius * (1 + gauntletInfo.aoeRadiusBonus);
}

/**
 * Calculate enhanced cone arc with Gauntlet bonus
 * @param baseArc - The base arc in degrees
 * @returns Enhanced arc with Gauntlet bonus
 */
export function calculateGauntletArc(baseArc: number): number {
  const gauntletInfo = getGauntletInfo();
  return Math.min(360, baseArc * (1 + gauntletInfo.coneArcBonus));
}

/**
 * Check if a power is a Tanker power
 */
export function isTankerPower(powersetId: string): boolean {
  return powersetId.startsWith('tanker/');
}

// ============================================
// CONTROLLER - CONTAINMENT
// ============================================

/**
 * Containment grants Controllers bonus damage against controlled enemies.
 *
 * Mechanics:
 * - Controllers deal double damage to enemies affected by status effects
 * - Qualifying status effects: Held, Immobilized, Slept, Disoriented (Stunned)
 * - The bonus is applied AFTER enhancements (100% extra damage)
 *
 * Example:
 * - Base attack: 30 damage
 * - With 99% enhancement: 30 × 1.99 = ~60 damage
 * - With Containment: 60 × 2 = 120 damage
 *
 * This encourages the "control first, attack second" playstyle.
 */

/** Status effects that trigger Containment */
export type ContainmentMezType = 'held' | 'immobilized' | 'slept' | 'disoriented';

export interface ContainmentInfo {
  /** Damage multiplier when target is controlled (2.0 = double damage) */
  damageMultiplier: number;
  /** List of mez types that trigger Containment */
  triggeringMezTypes: ContainmentMezType[];
  /** Description of the mechanic */
  description: string;
}

/**
 * Get Containment stats (constant values)
 */
export function getContainmentInfo(): ContainmentInfo {
  return {
    damageMultiplier: 2.0, // Double damage
    triggeringMezTypes: ['held', 'immobilized', 'slept', 'disoriented'],
    description: 'Double damage vs Held, Immobilized, Slept, or Disoriented targets',
  };
}

/**
 * Calculate damage bonus from Containment
 * @param isTargetControlled - Whether the target is affected by a qualifying mez
 * @returns Damage bonus as decimal (1.0 = 100% extra damage when controlled)
 */
export function calculateContainmentDamageBonus(isTargetControlled: boolean): number {
  if (!isTargetControlled) return 0;
  const info = getContainmentInfo();
  // Multiplier is 2.0, so bonus is 1.0 (100% extra)
  return info.damageMultiplier - 1;
}

/**
 * Calculate damage with Containment applied
 * Containment doubles damage AFTER enhancements
 * @param baseDamage - The damage after enhancements and buffs
 * @param isTargetControlled - Whether the target is affected by a qualifying mez
 * @returns Damage with Containment applied
 */
export function calculateContainmentDamage(baseDamage: number, isTargetControlled: boolean): number {
  if (!isTargetControlled) return baseDamage;
  const info = getContainmentInfo();
  return baseDamage * info.damageMultiplier;
}

/**
 * Check if a power is a Controller power
 */
export function isControllerPower(powersetId: string): boolean {
  return powersetId.startsWith('controller/');
}
