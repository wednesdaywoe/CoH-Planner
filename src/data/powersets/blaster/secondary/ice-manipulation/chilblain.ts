/**
 * Chilblain
 * Ranged, Moderate DoT(Cold), Foe Immobilize, -SPD, -Recharge
 *
 * Source: blaster_support/ice_manipulation/chilblain.json
 */

import type { Power } from '@/types';

export const Chilblain: Power = {
  "name": "Chilblain",
  "internalName": "Chilblain",
  "available": 0,
  "description": "Immobilizes your target in an icy trap. Deals some damage over time and slightly Slows the target's attack and movement speed. Useful for keeping villains at bay.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DoT(Cold), Foe Immobilize, -SPD, -Recharge",
  "icon": "icemanipulation_chillblains.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
