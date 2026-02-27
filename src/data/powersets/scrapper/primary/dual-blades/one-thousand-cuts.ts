/**
 * One Thousand Cuts
 * Melee (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: scrapper_melee/dual_blades/high_low.json
 */

import type { Power } from '@/types';

export const OneThousandCuts: Power = {
  "name": "One Thousand Cuts",
  "internalName": "High_Low",
  "available": 25,
  "description": "Unleashes a flurry of attacks on all foes in a cone in front of you, dealing moderate lethal damage to each foe hit. This power is the opening move for the Sweep combination attack.Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.",
  "shortHelp": "Melee (Cone), DMG(Lethal), Foe Knockback",
  "icon": "dualblades_highlow.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 3.3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.151,
      "table": "Melee_Damage",
      "duration": 2.05,
      "tickRate": 0.2
    },
    {
      "type": "Lethal",
      "scale": 0.7,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 2.21,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 2.21,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.068,
      "table": "Melee_Damage",
      "duration": 2.05,
      "tickRate": 0.2
    },
    {
      "type": "Fire",
      "scale": 0.315,
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
