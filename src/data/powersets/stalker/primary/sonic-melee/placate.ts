/**
 * Placate
 * Ranged, Foe Placate, Self Stealth/Hide
 *
 * Source: stalker_melee/sonic_melee/placate.json
 */

import type { Power } from '@/types';

export const Placate: Power = {
  "name": "Placate",
  "internalName": "Placate",
  "available": 11,
  "description": "Allows you to trick a foe to no longer attack you. A Successful Placate will also Hide you. This Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit or an Assassins Blow. However, if you attack a Placated Foe, he will be able to attack you back.",
  "shortHelp": "Ranged, Foe Placate, Self Stealth/Hide",
  "icon": "sonicmanipulation_placate.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 15,
    "recharge": 60,
    "castTime": 0.8,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Taunt",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "placate": {
      "scale": 10,
      "table": "Melee_Taunt"
    },
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
