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
    "accuracy": 1
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
      "scale": 0.5625,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 0.195,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.13,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    }
  }
};
