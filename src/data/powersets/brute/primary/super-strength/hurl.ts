/**
 * Hurl
 * Ranged, DMG(Smashing), Knockback, -Fly
 *
 * Source: brute_melee/super_strength/hurl.json
 */

import type { Power } from '@/types';

export const Hurl: Power = {
  "name": "Hurl",
  "internalName": "Hurl",
  "available": 21,
  "description": "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack deals high damage, and can knock foes back and even drop them out of the air if they are flying.",
  "shortHelp": "Ranged, DMG(Smashing), Knockback, -Fly",
  "icon": "superstrength_hurl.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 9.36,
    "castTime": 2.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Melee_Knockback"
    },
    "slow": {
      "fly": {
        "scale": 1,
        "table": "Melee_Ones"
      }
    }
  }
};
