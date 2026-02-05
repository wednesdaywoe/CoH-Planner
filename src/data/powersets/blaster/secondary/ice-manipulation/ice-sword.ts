/**
 * Ice Sword
 * Melee, High DMG(Cold/Lethal), Foe -Recharge, -SPD
 *
 * Source: blaster_support/ice_manipulation/ice_sword.json
 */

import type { Power } from '@/types';

export const IceSword: Power = {
  "name": "Ice Sword",
  "internalName": "Ice_Sword",
  "available": 3,
  "description": "You create a blade of solid ice that deals higher damage then Frozen Fists. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Cold/Lethal), Foe -Recharge, -SPD",
  "icon": "icemanipulation_icesword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
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
      "type": "Lethal",
      "scale": 0.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 1,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.1,
        "table": "Melee_Slow"
      },
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
