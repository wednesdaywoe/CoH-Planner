/**
 * Spine Burst
 * PBAoE Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge
 *
 * Source: brute_melee/spines/spine_burst.json
 */

import type { Power } from '@/types';

export const SpineBurst: Power = {
  "name": "Spine Burst",
  "internalName": "Spine_Burst",
  "available": 1,
  "description": "You can fling dozens of Spines in all directions. These Spines only travel a short distance, but they can deal moderate damage and poison any target close to you. Spine poison deals additional Toxic damage and Slows affected foes.",
  "shortHelp": "PBAoE Melee, DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
  "icon": "quills_flingquills.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67,
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
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.6,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 6.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.405,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 0.33,
      "scale": 10,
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
  }
};
