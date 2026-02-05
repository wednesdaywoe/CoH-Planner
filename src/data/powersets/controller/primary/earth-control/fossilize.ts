/**
 * Fossilize
 * Ranged, DMG(Smash), Foe Hold, -DEF
 *
 * Source: controller_control/earth_control/fossilize.json
 */

import type { Power } from '@/types';

export const Fossilize: Power = {
  "name": "Fossilize",
  "internalName": "Fossilize",
  "available": 0,
  "description": "Encases a single target within solid stone. The stone slowly crushes the victim, dealing Smashing damage. The Fossilized victim is held helpless and unable to defend themselves. Damage, Moderate.",
  "shortHelp": "Ranged, DMG(Smash), Foe Hold, -DEF",
  "icon": "earthgrasp_fossilize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    }
  }
};
