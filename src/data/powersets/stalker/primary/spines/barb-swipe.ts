/**
 * Barb Swipe
 * Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge
 *
 * Source: stalker_melee/spines/barb_swipe.json
 */

import type { Power } from '@/types';

export const BarbSwipe: Power = {
  "name": "Barb Swipe",
  "internalName": "Barb_Swipe",
  "available": 0,
  "description": "Shred your opponent with several quick Swipes from your Spines. Barb Swipe deals Light Lethal damage and a minor amount of additional Toxic damage over time and Slows affected foes.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
  "icon": "quills_swipe.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Slow Movement",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 0.33,
      "scale": 8,
      "table": "Melee_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    }
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
