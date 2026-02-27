/**
 * Placate
 * Ranged, Foe Placate, Self Stealth/Hide
 *
 * Source: teamwork/widow_teamwork/placate.json
 */

import type { Power } from '@/types';

export const Placate: Power = {
  "name": "Placate",
  "available": 23,
  "description": "Allow you to trick a foe to no longer attack you. A Successful Placate will also grant you stealth. However, if you attack a Placated Foe, he will be able to attack you back.",
  "shortHelp": "Ranged, Foe Placate, Self Stealth/Hide",
  "icon": "widowteamwork_placate.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 35,
    "endurance": 2.6,
    "castTime": 0.8,
    "radius": 15,
    "maxTargets": 5
  },
  "targetType": "Foe (Alive)",
  "effects": {
    "stealth": {
      "stealthPvE": {
        "scale": 150,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 380,
        "table": "Melee_Ones"
      },
      "translucency": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    }
  }
};
