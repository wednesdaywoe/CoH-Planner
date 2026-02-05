/**
 * Sweeping Strike
 * Melee (Cone), DMG(Lethal)
 *
 * Source: tanker_melee/dual_blades/special_2.json
 */

import type { Power } from '@/types';

export const SweepingStrike: Power = {
  "name": "Sweeping Strike",
  "internalName": "Special_2",
  "available": 27,
  "description": "You make a sweeping strike with your blades, hitting all foes in a cone in front of you and dealing superior lethal damage to each. This power is the finishing move for the Attack Vitals combination attack.Attack Vitals: Ablating Strike > Vengeful Slice > Sweeping Strike.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Cone), DMG(Lethal)",
  "icon": "dualblades_special2.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.23,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.7,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.2,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.765,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.0899,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
