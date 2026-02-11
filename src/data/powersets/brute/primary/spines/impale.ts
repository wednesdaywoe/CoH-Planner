/**
 * Impale
 * Ranged, DMG(Lethal), DoT(Toxic), Immobilize, -Recharge, -Fly
 *
 * Source: brute_melee/spines/impale.json
 */

import type { Power } from '@/types';

export const Impale: Power = {
  "name": "Impale",
  "internalName": "Impale",
  "available": 7,
  "description": "You can throw a single large Spine at a targeted foe. This Spine does only moderate damage, but carries a large amount of the Spine toxin. A successful attack can completely Immobilize most foes, as well as Slowing them and dealing Toxic poison damage. Impale can also bring down flying entities.",
  "shortHelp": "Ranged, DMG(Lethal), DoT(Toxic), Immobilize, -Recharge, -Fly",
  "icon": "quills_impale.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 2.23
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.2,
      "table": "Melee_Damage",
      "duration": 15.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Immobilize"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    },
    "regenDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
