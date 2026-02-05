/**
 * Frozen Fists
 * Melee, Moderate DMG(Cold/Smash), Foe -Recharge, -SPD
 *
 * Source: blaster_support/ice_manipulation/frozen_fists.json
 */

import type { Power } from '@/types';

export const FrozenFists: Power = {
  "name": "Frozen Fists",
  "internalName": "Frozen_Fists",
  "available": 0,
  "description": "Frozen Fists encrusts your hands in ice, giving them the ability to quickly inflict moderate damage on villains. The foe's attack and movement speed is Slowed, due to the chills caused by the cold blows.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, Moderate DMG(Cold/Smash), Foe -Recharge, -SPD",
  "icon": "icemanipulation_frozenfist.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.64,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.1,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
