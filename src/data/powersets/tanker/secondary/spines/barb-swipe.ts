/**
 * Barb Swipe
 * Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge
 *
 * Source: tanker_melee/spines/barb_swipe.json
 */

import type { Power } from '@/types';

export const BarbSwipe: Power = {
  "name": "Barb Swipe",
  "internalName": "Barb_Swipe",
  "available": 0,
  "description": "Melee, Light DMG(Lethal), DoT(Toxic), -SPD, -Recharge.",
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
    "Tanker Archetype Sets",
    "Threat Duration",
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
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
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
  "requires": "!Tanker_Defense.Shield_Defense"
};
