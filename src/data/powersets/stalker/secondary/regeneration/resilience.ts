/**
 * Resilience
 * Auto: Self +Res(Disorient, All DMG)
 *
 * Source: stalker_defense/regeneration/resilience.json
 */

import type { Power } from '@/types';

export const Resilience: Power = {
  "name": "Resilience",
  "internalName": "Resilience",
  "available": 19,
  "description": "You are more Resilient. This power allows you to build up a resistance to Disorientation effects. You tend not to get Disoriented, and if you do, it wears off quickly. This resistance to Disorientation gets stronger as you go up in level. Resilience also grants some resistance to all types of damage. This power is always on.",
  "shortHelp": "Auto: Self +Res(Disorient, All DMG)",
  "icon": "regeneration_resistance.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 1,
      "scale": 5,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 10.25,
    "resistance": {
      "smashing": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
