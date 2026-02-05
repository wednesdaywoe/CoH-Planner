/**
 * Lunge
 * Melee, DMG(Lethal), DoT(Toxic) -SPD, -Recharge
 *
 * Source: tanker_melee/spines/lunge.json
 */

import type { Power } from '@/types';

export const Lunge: Power = {
  "name": "Lunge",
  "internalName": "Lunge",
  "available": 0,
  "description": "You can lunge forward, stabbing and poisoning a foe with the large Spine on your arm. Lunge deals moderate damage. Spine poison deals additional Toxic damage and Slows affected foes.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic) -SPD, -Recharge",
  "icon": "quills_lunge.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.63
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
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.594,
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
