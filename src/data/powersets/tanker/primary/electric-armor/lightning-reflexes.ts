/**
 * Lightning Reflexes
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: tanker_defense/electric_armor/lightning_reflexes.json
 */

import type { Power } from '@/types';

export const LightningReflexes: Power = {
  "name": "Lightning Reflexes",
  "internalName": "Lightning_Reflexes",
  "available": 17,
  "description": "Your Lightning Reflexes allow you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "electricarmor_selfbuffrunspeed.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "activatePeriod": 10
  },
  "allowedEnhancements": [
    "Run Speed",
    "Fly"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "durations": {
      "rechargeBuff": 10.25,
      "movement": 10.25,
      "debuffResistance": 10.25
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedFlying"
      }
    },
    "debuffResistance": {
      "movement": {
        "scale": 0.4,
        "table": "Melee_Ones"
      },
      "recharge": {
        "scale": 0.4,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 10.25
  }
};
