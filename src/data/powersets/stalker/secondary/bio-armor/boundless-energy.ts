/**
 * Boundless Energy
 * Auto: +Max HP, +Regen, +Recovery, +Res(Slow, End Drain), +Special
 *
 * Source: stalker_defense/bio_organic_armor/boundless_energy.json
 */

import type { Power } from '@/types';

export const BoundlessEnergy: Power = {
  "name": "Boundless Energy",
  "internalName": "Boundless_Energy",
  "available": 3,
  "description": "Your body constantly evolves and addresses weaknesses. As a result you receive a moderate bonus to maximum hit points, regeneration, recovery as well as gaining a measure of Slow and Endurance Drain Resistance. Half of this power's maximum hit point increase is unenhanceable. While Efficient Adaptation is active, this power grants a small bonus to recovery and regeneration. While Defensive Adaptation is active you gain a small amount of additional maximum hit points. This power doesn't grant any bonuses to Offensive Adaptation. These special bonuses are unenhanceable. Boundless Energy is always active.",
  "shortHelp": "Auto: +Max HP, +Regen, +Recovery, +Res(Slow, End Drain), +Special",
  "icon": "bioorganicarmor_inexhaustible.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "activatePeriod": 5
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 1.8125,
      "table": "Melee_HealSelf"
    },
    "durations": {
      "maxHPBuff": 5.25,
      "regenBuff": 5.25,
      "recoveryBuff": 5.25,
      "debuffResistance": 5.25
    },
    "regenBuff": {
      "scale": 0.845,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.455,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "endurance": {
        "scale": 2,
        "table": "Melee_Res_Boolean"
      },
      "movement": {
        "scale": 0.3,
        "table": "Melee_Ones"
      },
      "recharge": {
        "scale": 0.3,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 5.25
  }
};
