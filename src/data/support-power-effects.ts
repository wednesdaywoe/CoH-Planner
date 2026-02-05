/**
 * Curated Support Power Effects Data
 *
 * This file provides effect data for support powers (heals, buffs, debuffs)
 * that is missing from the raw extracted power data. Values are sourced from
 * in-game testing and community resources.
 *
 * Effect values are given as "scale" values which get multiplied by:
 * - BASE_BUFF_DEBUFF (0.10) for buff/debuff percentages
 * - Archetype modifier for the powerset
 *
 * For example, a tohitDebuff of 2.5 scale with a Defender (1.25 modifier):
 * 2.5 * 0.10 * 1.25 = 31.25% ToHit debuff
 */

import type { PowerEffects } from '@/types/power';

/**
 * Effect overrides keyed by "powersetId/powerName"
 * These supplement or override the raw power data
 */
export const SUPPORT_POWER_EFFECTS: Record<string, Partial<PowerEffects>> = {
  // ============================================
  // DARKNESS AFFINITY (Controller/Defender/Corruptor/Mastermind secondary)
  // ============================================

  // Twilight Grasp - Team heal + debuffs
  'controller/darkness-affinity/Twilight Grasp': {
    tohitDebuff: 1.25, // -12.5% base, -15.63% defender
    damageDebuff: 0.75, // -7.5% base, -9.38% defender
    regenDebuff: 5.0, // -500% regen
    healing: { scale: 1.69, perTarget: false }, // 16.9% base heal
  },
  'defender/dark-miasma/Twilight Grasp': {
    tohitDebuff: 1.25,
    damageDebuff: 0.75,
    regenDebuff: 5.0,
    healing: { scale: 1.69, perTarget: false },
  },
  'corruptor/dark-miasma/Twilight Grasp': {
    tohitDebuff: 1.25,
    damageDebuff: 0.75,
    regenDebuff: 5.0,
    healing: { scale: 1.69, perTarget: false },
  },
  'mastermind/dark-miasma/Twilight Grasp': {
    tohitDebuff: 1.25,
    damageDebuff: 0.75,
    regenDebuff: 5.0,
    healing: { scale: 1.69, perTarget: false },
  },

  // Tar Patch - AoE slow + resist debuff
  'controller/darkness-affinity/Tar Patch': {
    slow: 0.70, // -70% movement speed
    resistanceDebuff: 3.0, // -30% resistance
  },
  'defender/dark-miasma/Tar Patch': {
    slow: 0.70,
    resistanceDebuff: 3.0,
  },
  'corruptor/dark-miasma/Tar Patch': {
    slow: 0.70,
    resistanceDebuff: 3.0,
  },
  'mastermind/dark-miasma/Tar Patch': {
    slow: 0.70,
    resistanceDebuff: 3.0,
  },

  // Darkest Night - Toggle AoE debuff
  'controller/darkness-affinity/Darkest Night': {
    tohitDebuff: 2.0, // -20% base
    damageDebuff: 1.5, // -15% base
  },
  'defender/dark-miasma/Darkest Night': {
    tohitDebuff: 2.0,
    damageDebuff: 1.5,
  },
  'corruptor/dark-miasma/Darkest Night': {
    tohitDebuff: 2.0,
    damageDebuff: 1.5,
  },
  'mastermind/dark-miasma/Darkest Night': {
    tohitDebuff: 2.0,
    damageDebuff: 1.5,
  },

  // Shadow Fall - Team stealth + defense + resist
  'controller/darkness-affinity/Shadow Fall': {
    defenseBuff: 0.525, // +5.25% base defense (all)
    resistance: {
      negative: 0.15, // +15% negative resistance
      psionic: 0.075, // +7.5% psionic resistance
    },
  },
  'defender/dark-miasma/Shadow Fall': {
    defenseBuff: 0.525,
    resistance: {
      negative: 0.15,
      psionic: 0.075,
    },
  },

  // Fade - Team defense buff
  'controller/darkness-affinity/Fade': {
    defenseBuff: 1.5, // +15% base defense (all)
  },
  'defender/dark-miasma/Fade': {
    defenseBuff: 1.875, // +18.75% with defender modifier
  },

  // ============================================
  // EMPATHY (Controller/Defender)
  // ============================================

  // Healing Aura - PBAoE team heal
  'controller/empathy/Healing Aura': {
    healing: { scale: 1.27, perTarget: true },
  },
  'defender/empathy/Healing Aura': {
    healing: { scale: 1.27, perTarget: true },
  },

  // Heal Other - Single target heal
  'controller/empathy/Heal Other': {
    healing: { scale: 4.22, perTarget: false },
  },
  'defender/empathy/Heal Other': {
    healing: { scale: 4.22, perTarget: false },
  },

  // Absorb Pain - High heal with self damage
  'controller/empathy/Absorb Pain': {
    healing: { scale: 8.44, perTarget: false },
  },
  'defender/empathy/Absorb Pain': {
    healing: { scale: 8.44, perTarget: false },
  },

  // Fortitude - Single target buff
  'controller/empathy/Fortitude': {
    tohitBuff: 1.5, // +15% base ToHit
    damageBuff: 1.5, // +15% base Damage
    defenseBuff: 1.125, // +11.25% base Defense
  },
  'defender/empathy/Fortitude': {
    tohitBuff: 1.5,
    damageBuff: 1.5,
    defenseBuff: 1.125,
  },

  // Recovery Aura - Team recovery + regen buff
  'controller/empathy/Recovery Aura': {
    recoveryBuff: 0.50, // +50% recovery
  },
  'defender/empathy/Recovery Aura': {
    recoveryBuff: 0.625, // +62.5% with defender modifier
  },

  // Regeneration Aura - Team regen buff
  'controller/empathy/Regeneration Aura': {
    // Regen buff not yet implemented in PowerEffects
  },
  'defender/empathy/Regeneration Aura': {
    // Regen buff not yet implemented in PowerEffects
  },

  // ============================================
  // KINETICS (Controller/Defender/Corruptor)
  // ============================================

  // Transfusion - Heal + end drain from foe
  'controller/kinetics/Transfusion': {
    healing: { scale: 1.69, perTarget: true },
  },
  'defender/kinetics/Transfusion': {
    healing: { scale: 1.69, perTarget: true },
  },
  'corruptor/kinetics/Transfusion': {
    healing: { scale: 1.69, perTarget: true },
  },

  // Siphon Power - Damage debuff + team damage buff
  'controller/kinetics/Siphon Power': {
    damageDebuff: 2.0, // -20% damage to target
    damageBuff: 1.0, // +10% damage to team
  },
  'defender/kinetics/Siphon Power': {
    damageDebuff: 2.0,
    damageBuff: 1.0,
  },
  'corruptor/kinetics/Siphon Power': {
    damageDebuff: 2.0,
    damageBuff: 1.0,
  },

  // Siphon Speed - Speed debuff + team speed/recharge buff
  'controller/kinetics/Siphon Speed': {
    slow: 0.40, // -40% speed to target
    speedBuff: 0.25, // +25% speed to self
    rechargeBuff: 0.20, // +20% recharge to self
  },
  'defender/kinetics/Siphon Speed': {
    slow: 0.40,
    speedBuff: 0.25,
    rechargeBuff: 0.20,
  },
  'corruptor/kinetics/Siphon Speed': {
    slow: 0.40,
    speedBuff: 0.25,
    rechargeBuff: 0.20,
  },

  // Speed Boost - Single target buff
  'controller/kinetics/Speed Boost': {
    speedBuff: 0.50, // +50% run speed
    rechargeBuff: 0.20, // +20% recharge
    recoveryBuff: 0.25, // +25% recovery
  },
  'defender/kinetics/Speed Boost': {
    speedBuff: 0.50,
    rechargeBuff: 0.20,
    recoveryBuff: 0.25,
  },
  'corruptor/kinetics/Speed Boost': {
    speedBuff: 0.50,
    rechargeBuff: 0.20,
    recoveryBuff: 0.25,
  },

  // Fulcrum Shift - AoE damage buff
  'controller/kinetics/Fulcrum Shift': {
    damageDebuff: 2.5, // -25% to targets
    damageBuff: 2.5, // +25% per target hit (base, stacks up to +300%)
  },
  'defender/kinetics/Fulcrum Shift': {
    damageDebuff: 2.5,
    damageBuff: 2.5,
  },
  'corruptor/kinetics/Fulcrum Shift': {
    damageDebuff: 2.5,
    damageBuff: 2.5,
  },

  // ============================================
  // RADIATION EMISSION (Controller/Defender/Corruptor)
  // ============================================

  // Radiant Aura - PBAoE heal
  'controller/radiation-emission/Radiant Aura': {
    healing: { scale: 1.27, perTarget: true },
  },
  'defender/radiation-emission/Radiant Aura': {
    healing: { scale: 1.27, perTarget: true },
  },
  'corruptor/radiation-emission/Radiant Aura': {
    healing: { scale: 1.27, perTarget: true },
  },
  'mastermind/radiation-emission/Radiant Aura': {
    healing: { scale: 1.27, perTarget: true },
  },

  // Radiation Infection - Toggle debuff aura
  // Base: 29.25% ToHit/Defense debuff (scale 2.925 * 0.10)
  // Defender (1.25): 36.56%, Controller (1.0): 29.25%, Corruptor (0.75): 21.94%
  'controller/radiation-emission/Radiation Infection': {
    tohitDebuff: 2.925, // -29.25% base
    defenseDebuff: 2.925, // -29.25% base
  },
  'defender/radiation-emission/Radiation Infection': {
    tohitDebuff: 2.925,
    defenseDebuff: 2.925,
  },
  'corruptor/radiation-emission/Radiation Infection': {
    tohitDebuff: 2.925,
    defenseDebuff: 2.925,
  },
  'mastermind/radiation-emission/Radiation Infection': {
    tohitDebuff: 2.925,
    defenseDebuff: 2.925,
  },

  // Enervating Field - Toggle resist debuff
  'controller/radiation-emission/Enervating Field': {
    resistanceDebuff: 3.0, // -30% base
    damageDebuff: 1.0, // -10% base
  },
  'defender/radiation-emission/Enervating Field': {
    resistanceDebuff: 3.0,
    damageDebuff: 1.0,
  },
  'corruptor/radiation-emission/Enervating Field': {
    resistanceDebuff: 3.0,
    damageDebuff: 1.0,
  },
  'mastermind/radiation-emission/Enervating Field': {
    resistanceDebuff: 3.0,
    damageDebuff: 1.0,
  },

  // Accelerate Metabolism - Team buff
  'controller/radiation-emission/Accelerate Metabolism': {
    damageBuff: 0.625, // +6.25% base damage
    tohitBuff: 0.625, // +6.25% base ToHit
    speedBuff: 0.20, // +20% speed
    rechargeBuff: 0.20, // +20% recharge
    recoveryBuff: 0.25, // +25% recovery
  },
  'defender/radiation-emission/Accelerate Metabolism': {
    damageBuff: 0.625,
    tohitBuff: 0.625,
    speedBuff: 0.20,
    rechargeBuff: 0.20,
    recoveryBuff: 0.25,
  },
  'corruptor/radiation-emission/Accelerate Metabolism': {
    damageBuff: 0.625,
    tohitBuff: 0.625,
    speedBuff: 0.20,
    rechargeBuff: 0.20,
    recoveryBuff: 0.25,
  },
  'mastermind/radiation-emission/Accelerate Metabolism': {
    damageBuff: 0.625,
    tohitBuff: 0.625,
    speedBuff: 0.20,
    rechargeBuff: 0.20,
    recoveryBuff: 0.25,
  },

  // Lingering Radiation - AoE slow + regen debuff
  'controller/radiation-emission/Lingering Radiation': {
    slow: 0.50, // -50% speed
    regenDebuff: 10.0, // -1000% regen
    rechargeBuff: -0.40, // -40% recharge (debuff)
  },
  'defender/radiation-emission/Lingering Radiation': {
    slow: 0.50,
    regenDebuff: 10.0,
    rechargeBuff: -0.40,
  },
  'corruptor/radiation-emission/Lingering Radiation': {
    slow: 0.50,
    regenDebuff: 10.0,
    rechargeBuff: -0.40,
  },
  'mastermind/radiation-emission/Lingering Radiation': {
    slow: 0.50,
    regenDebuff: 10.0,
    rechargeBuff: -0.40,
  },

  // ============================================
  // COLD DOMINATION (Controller/Defender/Corruptor/Mastermind)
  // ============================================

  // Ice Shield - Single target defense buff
  'controller/cold-domination/Ice Shield': {
    defenseBuff: 1.5, // +15% base smashing/lethal defense
  },
  'defender/cold-domination/Ice Shield': {
    defenseBuff: 1.875, // +18.75% with defender modifier
  },

  // Glacial Shield - Single target defense buff
  'controller/cold-domination/Glacial Shield': {
    defenseBuff: 1.125, // +11.25% base energy/negative defense
  },
  'defender/cold-domination/Glacial Shield': {
    defenseBuff: 1.40625, // with defender modifier
  },

  // Infrigidate - Single target debuff
  'controller/cold-domination/Infrigidate': {
    slow: 0.40, // -40% speed
    tohitDebuff: 1.0, // -10% base
    damageDebuff: 1.5, // -15% base
  },
  'defender/cold-domination/Infrigidate': {
    slow: 0.40,
    tohitDebuff: 1.0,
    damageDebuff: 1.5,
  },

  // Snow Storm - Toggle AoE slow
  'controller/cold-domination/Snow Storm': {
    slow: 0.60, // -60% speed
    rechargeBuff: -0.20, // -20% recharge (debuff)
  },
  'defender/cold-domination/Snow Storm': {
    slow: 0.60,
    rechargeBuff: -0.20,
  },

  // Benumb - Single target major debuff
  'controller/cold-domination/Benumb': {
    damageDebuff: 3.0, // -30% damage
    regenDebuff: 5.0, // -500% regen
    resistanceDebuff: 3.0, // -30% resist (special)
  },
  'defender/cold-domination/Benumb': {
    damageDebuff: 3.0,
    regenDebuff: 5.0,
    resistanceDebuff: 3.0,
  },

  // Heat Loss - AoE debuff + team recovery
  'controller/cold-domination/Heat Loss': {
    resistanceDebuff: 3.0, // -30% resist
    damageDebuff: 1.5, // -15% damage
    recoveryBuff: 0.50, // +50% recovery to team
  },
  'defender/cold-domination/Heat Loss': {
    resistanceDebuff: 3.0,
    damageDebuff: 1.5,
    recoveryBuff: 0.50,
  },

  // ============================================
  // STORM SUMMONING (Controller/Defender/Corruptor/Mastermind)
  // ============================================

  // O2 Boost - Single target heal + status protection
  'controller/storm-summoning/O2 Boost': {
    healing: { scale: 3.17, perTarget: false },
  },
  'defender/storm-summoning/O2 Boost': {
    healing: { scale: 3.17, perTarget: false },
  },

  // Freezing Rain - AoE debuff patch
  'controller/storm-summoning/Freezing Rain': {
    slow: 0.70, // -70% speed
    defenseDebuff: 2.0, // -20% base defense
    resistanceDebuff: 3.0, // -30% base resist
  },
  'defender/storm-summoning/Freezing Rain': {
    slow: 0.70,
    defenseDebuff: 2.0,
    resistanceDebuff: 3.0,
  },
  'corruptor/storm-summoning/Freezing Rain': {
    slow: 0.70,
    defenseDebuff: 2.0,
    resistanceDebuff: 3.0,
  },

  // Hurricane - PBAoE toggle debuff
  'controller/storm-summoning/Hurricane': {
    tohitDebuff: 3.0, // -30% base
    defenseDebuff: 2.0, // -20% base (ranged)
  },
  'defender/storm-summoning/Hurricane': {
    tohitDebuff: 3.0,
    defenseDebuff: 2.0,
  },

  // ============================================
  // NATURE AFFINITY (Controller/Defender/Corruptor/Mastermind)
  // ============================================

  // Corrosive Enzymes - AoE resist debuff
  'controller/nature-affinity/Corrosive Enzymes': {
    resistanceDebuff: 2.0, // -20% base
  },
  'defender/nature-affinity/Corrosive Enzymes': {
    resistanceDebuff: 2.0,
  },

  // Wild Bastion - Single target heal
  'controller/nature-affinity/Wild Bastion': {
    healing: { scale: 3.17, perTarget: false },
  },
  'defender/nature-affinity/Wild Bastion': {
    healing: { scale: 3.17, perTarget: false },
  },

  // Regrowth - PBAoE team heal
  'controller/nature-affinity/Regrowth': {
    healing: { scale: 1.27, perTarget: true },
  },
  'defender/nature-affinity/Regrowth': {
    healing: { scale: 1.27, perTarget: true },
  },

  // Lifegiving Spores - Location AoE heal over time
  'controller/nature-affinity/Lifegiving Spores': {
    healing: { scale: 0.42, perTarget: true }, // Per tick
  },
  'defender/nature-affinity/Lifegiving Spores': {
    healing: { scale: 0.42, perTarget: true },
  },

  // Overgrowth - Team damage buff
  'controller/nature-affinity/Overgrowth': {
    damageBuff: 2.5, // +25% base damage
    tohitBuff: 1.25, // +12.5% base ToHit
  },
  'defender/nature-affinity/Overgrowth': {
    damageBuff: 2.5,
    tohitBuff: 1.25,
  },

  // ============================================
  // TIME MANIPULATION (Controller/Defender/Corruptor/Mastermind)
  // ============================================

  // Time Crawl - Single target slow
  'controller/time-manipulation/Time Crawl': {
    slow: 0.50, // -50% speed
    rechargeBuff: -0.30, // -30% recharge (debuff)
    tohitDebuff: 1.0, // -10% base
  },
  'defender/time-manipulation/Time Crawl': {
    slow: 0.50,
    rechargeBuff: -0.30,
    tohitDebuff: 1.0,
  },

  // Temporal Selection - Single target buff
  'controller/time-manipulation/Temporal Selection': {
    damageBuff: 1.0, // +10% base damage
    tohitBuff: 1.0, // +10% base ToHit
    rechargeBuff: 0.20, // +20% recharge
  },
  'defender/time-manipulation/Temporal Selection': {
    damageBuff: 1.0,
    tohitBuff: 1.0,
    rechargeBuff: 0.20,
  },

  // Time's Juncture - PBAoE toggle debuff
  'controller/time-manipulation/Time\'s Juncture': {
    tohitDebuff: 1.2, // -12% base
    slow: 0.30, // -30% speed
  },
  'defender/time-manipulation/Time\'s Juncture': {
    tohitDebuff: 1.2,
    slow: 0.30,
  },

  // Farsight - Team defense + ToHit buff
  'controller/time-manipulation/Farsight': {
    defenseBuff: 0.9, // +9% base defense
    tohitBuff: 1.2, // +12% base ToHit
  },
  'defender/time-manipulation/Farsight': {
    defenseBuff: 0.9,
    tohitBuff: 1.2,
  },

  // Chrono Shift - Team endurance recovery
  'controller/time-manipulation/Chrono Shift': {
    recoveryBuff: 0.75, // +75% recovery
  },
  'defender/time-manipulation/Chrono Shift': {
    recoveryBuff: 0.75,
  },

  // ============================================
  // PAIN DOMINATION (Corruptor/Mastermind)
  // ============================================

  // Nullify Pain - PBAoE heal
  'corruptor/pain-domination/Nullify Pain': {
    healing: { scale: 1.27, perTarget: true },
  },
  'mastermind/pain-domination/Nullify Pain': {
    healing: { scale: 1.27, perTarget: true },
  },

  // Soothe - Single target heal
  'corruptor/pain-domination/Soothe': {
    healing: { scale: 4.22, perTarget: false },
  },
  'mastermind/pain-domination/Soothe': {
    healing: { scale: 4.22, perTarget: false },
  },

  // Share Pain - High heal with self damage
  'corruptor/pain-domination/Share Pain': {
    healing: { scale: 8.44, perTarget: false },
  },
  'mastermind/pain-domination/Share Pain': {
    healing: { scale: 8.44, perTarget: false },
  },

  // Anguishing Cry - AoE ToHit/Damage debuff
  'corruptor/pain-domination/Anguishing Cry': {
    tohitDebuff: 1.5, // -15% base
    damageDebuff: 1.5, // -15% base
  },
  'mastermind/pain-domination/Anguishing Cry': {
    tohitDebuff: 1.5,
    damageDebuff: 1.5,
  },

  // Suppress Pain - Team defense/resist buff
  'corruptor/pain-domination/Suppression Pain': {
    defenseBuff: 0.375, // +3.75% base defense
    resistance: {
      smashing: 0.075, // +7.5% resist
      lethal: 0.075,
      fire: 0.075,
      cold: 0.075,
      energy: 0.075,
      negative: 0.075,
      psionic: 0.075,
      toxic: 0.075,
    },
  },
  'mastermind/pain-domination/Suppression Pain': {
    defenseBuff: 0.375,
    resistance: {
      smashing: 0.075,
      lethal: 0.075,
      fire: 0.075,
      cold: 0.075,
      energy: 0.075,
      negative: 0.075,
      psionic: 0.075,
      toxic: 0.075,
    },
  },
};

/**
 * Get supplemental effects for a power
 * @param powersetId - The powerset ID (e.g., "controller/darkness-affinity")
 * @param powerName - The power name
 * @returns Additional effects to merge with the raw power data
 */
export function getSupportPowerEffects(
  powersetId: string,
  powerName: string
): Partial<PowerEffects> | undefined {
  const key = `${powersetId}/${powerName}`;
  return SUPPORT_POWER_EFFECTS[key];
}

/**
 * Merge raw power effects with curated support effects
 * @param rawEffects - The effects from the raw power data
 * @param powersetId - The powerset ID
 * @param powerName - The power name
 * @returns Merged effects object
 */
export function mergeWithSupportEffects(
  rawEffects: PowerEffects | undefined,
  powersetId: string,
  powerName: string
): PowerEffects {
  const supportEffects = getSupportPowerEffects(powersetId, powerName);
  if (!supportEffects) {
    return rawEffects || {};
  }
  return {
    ...rawEffects,
    ...supportEffects,
  };
}
