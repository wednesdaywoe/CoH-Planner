/**
 * Ice Bolt
 * Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD
 *
 * Source: dominator_assault/icy_assault/ice_bolt.json
 */

import type { Power } from '@/types';

export const IceBolt: Power = {
  "name": "Ice Bolt",
  "internalName": "Ice_Bolt",
  "available": 0,
  "description": "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Cold/Smash), Foe -Recharge, -SPD",
  "icon": "iceassault_bolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 1
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
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.232,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.928,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
