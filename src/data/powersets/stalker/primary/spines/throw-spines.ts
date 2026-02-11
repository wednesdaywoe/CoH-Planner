/**
 * Throw Spines
 * Ranged (Cone), DMG(Lethal), DoT(Toxic), -SPD, -Recharge
 *
 * Source: stalker_melee/spines/throw_spines.json
 */

import type { Power } from '@/types';

export const ThrowSpines: Power = {
  "name": "Throw Spines",
  "internalName": "Throw_Spines",
  "available": 25,
  "description": "You can throw dozens of Spines in a wide cone in front of you, impaling foes caught within the range. Spine throwing deals moderate lethal damage, and poisons any targets it hits. Spine poison deals additional Toxic damage and Slows affected foes. If executed while hidden, all affected targets have a chance to be hit with a Critical Hit for extra damage.",
  "shortHelp": "Ranged (Cone), DMG(Lethal), DoT(Toxic), -SPD, -Recharge",
  "icon": "quills_quillthrowing.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 1.5708,
    "recharge": 12,
    "endurance": 13,
    "castTime": 1.63,
    "maxTargets": 10
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
    "Ranged AoE Damage",
    "Slow Movement",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.09,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 7.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
