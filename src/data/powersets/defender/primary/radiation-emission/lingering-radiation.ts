/**
 * Lingering Radiation
 * Ranged (Targeted AoE), Foe -Speed, -Recharge, -Regen
 *
 * Source: defender_buff/radiation_emission/lingering_radiation.json
 */

import type { Power } from '@/types';

export const LingeringRadiation: Power = {
  "name": "Lingering Radiation",
  "internalName": "Lingering_radiation",
  "available": 11,
  "description": "You can emit Lingering Radiation that reduces the attack rate, movement speed, and Regeneration rate of the target, and all nearby foes.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe -Speed, -Recharge, -Regen",
  "icon": "radiationpoisoning_lingeringradiation.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.6,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.6,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.6,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.6,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.6,
      "table": "Ranged_Slow"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "regenDebuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    }
  }
};
