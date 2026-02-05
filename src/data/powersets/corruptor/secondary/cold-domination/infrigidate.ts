/**
 * Infrigidate
 * Ranged Foe -Speed, -Recharge, -DEF, -DMG (Fire)
 *
 * Source: corruptor_buff/cold_domination/infrigidate.json
 */

import type { Power } from '@/types';

export const Infrigidate: Power = {
  "name": "Infrigidate",
  "internalName": "Infrigidate",
  "available": 0,
  "description": "Fires a frigid beam of cold at a single target. This beam dramatically reduces the target's attack rate, movement speed and Defense. Infrigidate draws so much heat out of the target that the damage of any of its Fire attacks will be reduced.Recharge: Slow.",
  "shortHelp": "Ranged Foe -Speed, -Recharge, -DEF, -DMG (Fire)",
  "icon": "colddomination_infrigidate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 15,
    "endurance": 10.4,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.7,
      "table": "Ranged_Slow"
    },
    "defenseDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_Def"
    },
    "damageDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Dam"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    }
  }
};
