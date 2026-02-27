/**
 * Greater Ice Sword
 * Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD
 *
 * Source: tanker_melee/ice_melee/greater_ice_sword.json
 */

import type { Power } from '@/types';

export const GreaterIceSword: Power = {
  "name": "Greater Ice Sword",
  "internalName": "Greater_Ice_Sword",
  "available": 27,
  "description": "Your mastery of Ice allows you to create an enhanced blade of solid ice that deals above average damage. Being hit by the Greater Ice Sword will Slow a villain's attack and movement speed, due to the intense chill.",
  "shortHelp": "Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD",
  "icon": "icyonslaught_greatericesword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 2.33
  },
  "allowedEnhancements": [
    "Slow",
    "Taunt",
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
      "scale": 0.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.882,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
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
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
