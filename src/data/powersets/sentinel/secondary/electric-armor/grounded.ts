/**
 * Grounded
 * Auto: Self +Res (All DMG but Toxic and Psionics, End Drain, Immobilize, KB)
 *
 * Source: sentinel_defense/electric_armor/grounded.json
 */

import type { Power } from '@/types';

export const Grounded: Power = {
  "name": "Grounded",
  "internalName": "Grounded",
  "available": 19,
  "description": "You are Grounded and naturally very resistant to Energy and Negative Energy damage. You also have added resistance to Endurance Drain effects. Additionally, Grounded provides Immobilize, Knockback protection and the Grounded status, but only for up to 10 seconds after being near the ground. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (All DMG but Toxic and Psionics, End Drain, Immobilize, KB)",
  "icon": "electricarmor_selfresistenergies.png",
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
    "resistance": {
      "smashing": {
        "scale": 0.8,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.8,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 0.8,
        "table": "Melee_Res_Dmg"
      },
      "cold": {
        "scale": 0.8,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 6,
      "table": "Melee_Knockback"
    },
    "knockback": {
      "scale": 6,
      "table": "Melee_Knockback"
    },
    "immobilize": {
      "mag": 1,
      "scale": 6,
      "table": "Melee_Ones"
    },
    "effectDuration": 1
  }
};
