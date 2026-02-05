/**
 * Stone Prison
 * Ranged, Moderate DoT(Smash), Foe Immobilize, -DEF, -Fly
 *
 * Source: blaster_support/earth_manipulation/stone_prison.json
 */

import type { Power } from '@/types';

export const StonePrison: Power = {
  "name": "Stone Prison",
  "internalName": "Stone_Prison",
  "available": 0,
  "description": "Immobilizes a single target within an earthy formation and deals some Smashing damage over time. Some more resilient foes may require multiple attacks to Immobilize. Stone Prison can also reduce a target's Defense.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DoT(Smash), Foe Immobilize, -DEF, -Fly",
  "icon": "earthmanip_stoneprison.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.23
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Immobilize",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
