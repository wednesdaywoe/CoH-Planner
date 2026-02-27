/**
 * Inexhaustible
 * Auto: +Max HP, +Regen, +Recovery, +Res(Slow, End Drain), +Special
 *
 * Source: sentinel_defense/bio_organic_armor/inexhaustible.json
 */

import type { Power } from '@/types';

export const Inexhaustible: Power = {
  "name": "Inexhaustible",
  "internalName": "Inexhaustible",
  "available": 0,
  "description": "Your body constantly evolves and addresses weaknesses. As a result you receive a moderate bonus to maximum hit points, regeneration, and recovery, as well as gaining a measure of Slow and Endurance Drain Resistance. Half of this power's maximum hit point increase is unenhanceable.*This power doesn't grant any bonuses to Offensive Adaptation.*While Defensive Adaptation is active you gain a small amount of additional maximum hit points.*While Efficient Adaptation is active, this power grants a small bonus to recovery and regeneration.Bonuses granted from Adaptations are unenhanceable.This power is always active and costs no endurance.",
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
      "scale": 0.45,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.1,
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
