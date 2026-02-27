/**
 * Lightning Reflexes
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: sentinel_defense/electric_armor/lightning_reflexes.json
 */

import type { Power } from '@/types';

export const LightningReflexes: Power = {
  "name": "Lightning Reflexes",
  "internalName": "Lightning_Reflexes",
  "available": 23,
  "description": "Your Lightning Reflexes allow you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "electricarmor_selfbuffrunspeed.png",
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
