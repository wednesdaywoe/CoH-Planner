/**
 * Toroidal Bubble
 * PBAoE, Team +Res(All DMG, End Drain), +End, +Recovery, +Jump
 *
 * Source: mastermind_buff/marine_affinity/toroidal_bubble.json
 */

import type { Power } from '@/types';

export const ToroidalBubble: Power = {
  "name": "Toroidal Bubble",
  "internalName": "Toroidal_Bubble",
  "available": 3,
  "description": "You create a ring of Bubbles that surrounds your allies, hydrating them to replenish endurance and reducing the effects of endurance drain. The bubble also reduces all incoming damage, providing extra resistance to Smashing and Fire damage, and also increases jump height thanks to added buoyancy.",
  "shortHelp": "PBAoE, Team +Res(All DMG, End Drain), +End, +Recovery, +Jump",
  "icon": "marineaffinity_toroidalbubble.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 40,
    "recharge": 60,
    "endurance": 10,
    "castTime": 1.77,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Jump"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Leaping",
    "Leaping & Sprints",
    "Resist Damage",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.25,
        "table": "Melee_Leap"
      }
    },
    "resistance": {
      "smashing": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Ranged_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
