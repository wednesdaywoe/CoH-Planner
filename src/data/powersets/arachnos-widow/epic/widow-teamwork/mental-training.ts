/**
 * Mental Training
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: teamwork/widow_teamwork/mental_training.json
 */

import type { Power } from '@/types';

export const MentalTraining: Power = {
  "name": "Mental Training",
  "internalName": "Mental_Training",
  "available": 21,
  "description": "Your mental training allows you to focus your will, allowing you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "widowteamwork_mentaltraining.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Run Speed",
    "Fly"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "recharge": {
        "scale": 0.4,
        "table": "Melee_Ones"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.4,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedFlying"
      }
    },
    "durations": {
      "debuffResistance": 10.25,
      "movement": 10.25,
      "rechargeBuff": 10.25
    }
  }
};
