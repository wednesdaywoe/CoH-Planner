/**
 * ESD Arrow
 * Ranged (Targeted AoE), Foe Disorient, -End, Special vs. Robots
 *
 * Source: blaster_support/tactical_arrow/emp_arrow.json
 */

import type { Power } from '@/types';

export const ESDArrow: Power = {
  "name": "ESD Arrow",
  "internalName": "EMP_Arrow",
  "available": 27,
  "description": "This arrow can unleash a massive electrostatic discharge on impact. This ESD can affect machines, and is even powerful enough to affect synaptic brain patterns. It will stun all foes in its radius. Additionally, most machines and robots will be held and take moderate high damage.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe Disorient, -End, Special vs. Robots",
  "icon": "tacticalarrow_stun.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 20,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Holds",
    "Stuns"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.55,
      "table": "Ranged_Ones"
    },
    "hold": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
