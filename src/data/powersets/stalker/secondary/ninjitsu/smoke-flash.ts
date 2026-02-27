/**
 * Smoke Flash
 * PBAoE, Foe Placate
 *
 * Source: stalker_defense/ninjitsu/smoke_flash.json
 */

import type { Power } from '@/types';

export const SmokeFlash: Power = {
  "name": "Smoke Flash",
  "internalName": "Smoke_Flash",
  "available": 23,
  "description": "You throw a smoke bomb at your feet. The resulting flash of light and smoke can briefly distract your foes and Placate them so they can no longer find or target you. Combined with Hide, Smoke Flash is the perfect distraction to get out of a bad situation.Recharge: Long.",
  "shortHelp": "PBAoE, Foe Placate",
  "icon": "ninjitsu_smokeflash.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 20,
    "recharge": 120,
    "endurance": 2.6,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "placate": {
      "scale": 8,
      "table": "Melee_Taunt"
    }
  }
};
