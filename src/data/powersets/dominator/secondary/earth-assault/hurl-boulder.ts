/**
 * Hurl Boulder
 * Ranged, High DMG(Smash), Foe Knockback, -Fly
 *
 * Source: dominator_assault/earth_assault/hurl_boulder.json
 */

import type { Power } from '@/types';

export const HurlBoulder: Power = {
  "name": "Hurl Boulder",
  "internalName": "Hurl_Boulder",
  "available": 9,
  "description": "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack deals moderate damage, and can knock foes back and even drop them out of the air if they are flying.Damage: High.Recharge: Slow.",
  "shortHelp": "Ranged, High DMG(Smash), Foe Knockback, -Fly",
  "icon": "earthassault_hurlboulder.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.28,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Ranged_Knockback"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
