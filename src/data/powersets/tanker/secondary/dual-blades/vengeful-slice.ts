/**
 * Vengeful Slice
 * Melee, DMG(Lethal), Knockdown
 *
 * Source: tanker_melee/dual_blades/special_1.json
 */

import type { Power } from '@/types';

export const VengefulSlice: Power = {
  "name": "Vengeful Slice",
  "internalName": "Special_1",
  "available": 23,
  "description": "Unleashes a series of strong attacks on your foe, dealing high lethal damage and knocking them down. This power is needed for the Attack Vitals combination attack.Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.",
  "shortHelp": "Melee, DMG(Lethal), Knockdown",
  "icon": "dualblades_special1.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.43
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.41,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1845,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1845,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1845,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1845,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
