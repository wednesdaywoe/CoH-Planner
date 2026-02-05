/**
 * Ice Sword
 * Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD
 *
 * Source: stalker_melee/ice_melee/ice_sword.json
 */

import type { Power } from '@/types';

export const IceSword: Power = {
  "name": "Ice Sword",
  "internalName": "Ice_Sword",
  "available": 0,
  "description": "You create a blade of solid ice that deals good damage. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.",
  "shortHelp": "Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD",
  "icon": "icyonslaught_icesword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
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
    "Melee Damage",
    "Slow Movement",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.82,
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
    }
  }
};
