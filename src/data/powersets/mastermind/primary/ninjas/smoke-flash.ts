/**
 * Smoke Flash
 * Hide Ninja
 *
 * Source: mastermind_summon/ninjas/smoke_flash.json
 */

import type { Power } from '@/types';

export const SmokeFlash: Power = {
  "name": "Smoke Flash",
  "internalName": "Smoke_Flash",
  "available": 17,
  "description": "You can command one of your Ninja Henchmen to throw down a Smoke Bomb. The Smoke Flash will allow the Ninja to Placate his nearby foes, and thus unable to target the Ninja. The Smoke Flash also makes all your Ninja stealthy and Hidden for 3 seconds, enabling them to perform Critical hits with their next few attacks. You can only use this power on a Ninja Henchmen.",
  "shortHelp": "Hide Ninja",
  "icon": "ninjas_kujikiri.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "radius": 100,
    "recharge": 90,
    "endurance": 15,
    "castTime": 1.17,
    "maxTargets": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "stealth": {
      "stealthPvE": {
        "scale": 54,
        "table": "Ranged_Ones"
      },
      "stealthPvP": {
        "scale": 500,
        "table": "Ranged_Ones"
      },
      "translucency": {
        "scale": 0.2,
        "table": "Ranged_Ones"
      }
    }
  }
};
