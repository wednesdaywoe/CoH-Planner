/**
 * Ice Slash
 * Melee, Superior DMG(Cold/Lethal), Foe -Recharge, -SPD
 *
 * Source: dominator_assault/icy_assault/greater_ice_sword.json
 */

import type { Power } from '@/types';

export const IceSlash: Power = {
  "name": "Ice Slash",
  "internalName": "Greater_Ice_Sword",
  "available": 27,
  "description": "Ice Slash allows the user to create a blade of solid ice and strike a foe for high damage. Being hit by Ice Slash will Slow a foes' attack and movement speed, due to the intense chill.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Cold/Lethal), Foe -Recharge, -SPD",
  "icon": "iceassault_iceswordcleave.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 17,
    "endurance": 16.016,
    "castTime": 1.83
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.54,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 1.54,
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
