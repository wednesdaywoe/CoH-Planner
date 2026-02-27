/**
 * Quickness
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: brute_defense/super_reflexes/quickness.json
 */

import type { Power } from '@/types';

export const Quickness: Power = {
  "name": "Quickness",
  "internalName": "Quickness",
  "available": 27,
  "description": "Your Quick reflexes allow you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "superreflexes_quickness.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Run Speed",
    "Fly"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.4,
      "table": "Melee_Ones"
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
    }
  }
};
