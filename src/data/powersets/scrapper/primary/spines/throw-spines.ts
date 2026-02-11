/**
 * Throw Spines
 * Ranged (Cone), DMG(Lethal), DoT(Toxic), -SPD, -Recharge
 *
 * Source: scrapper_melee/quills/quill_throwing.json
 */

import type { Power } from '@/types';

export const ThrowSpines: Power = {
  "name": "Throw Spines",
  "internalName": "Quill_Throwing",
  "available": 25,
  "description": "You can throw dozens of Spines in a wide cone in front of you, impaling foes caught within the range. Spine throwing deals moderate damage, and poisons any targets it hits. Spine poison deals additional Toxic damage and Slows affected foes.",
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
    "Scrapper Archetype Sets",
    "Slow Movement",
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
    },
    {
      "type": "Lethal",
      "scale": 1.09,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.09,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.4905,
      "table": "Melee_Damage"
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
    },
    "immobilize": {
      "mag": 0.67,
      "scale": 10,
      "table": "Melee_Immobilize"
    }
  }
};
