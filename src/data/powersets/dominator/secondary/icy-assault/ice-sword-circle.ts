/**
 * Ice Sword Circle
 * PBAoE Melee, Light DMG(Cold/Lethal), Foe -Recharge, -SPD
 *
 * Source: dominator_assault/icy_assault/ice_sword_circle.json
 */

import type { Power } from '@/types';

export const IceSwordCircle: Power = {
  "name": "Ice Sword Circle",
  "internalName": "Ice_Sword_Circle",
  "available": 3,
  "description": "Mastery of your Ice Sword has enabled you to make an attack on every foe within melee distance. This will slash and chill your enemies, dealing moderate damage and slowing all affected targets' movement and attack speed.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Cold/Lethal), Foe -Recharge, -SPD",
  "icon": "iceassault_iceswordcircle.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 22,
    "endurance": 20.176,
    "castTime": 2.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.595,
      "table": "Melee_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.595,
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
