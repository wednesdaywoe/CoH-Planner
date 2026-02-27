/**
 * Dart Burst
 * Ranged Cone, DMG(Lethal), DoT(Toxic), -Regeneration
 *
 * Source: widow_training/widow_training/dart_burst.json
 */

import type { Power } from '@/types';

export const DartBurst: Power = {
  "name": "Dart Burst",
  "available": 5,
  "description": "Dart Burst does light lethal damage to foes in a 30 degree arc cone, then poisons them. The poison does toxic damage over time and reduces their regeneration rate.",
  "shortHelp": "Ranged Cone, DMG(Lethal), DoT(Toxic), -Regeneration",
  "icon": "widowtraining_dartburst.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 50,
    "recharge": 8,
    "endurance": 9.746,
    "castTime": 2,
    "radius": 50,
    "arc": 0.5236,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.255,
      "table": "Ranged_Damage",
      "duration": 0.8,
      "tickRate": 0.33
    },
    {
      "type": "Toxic",
      "scale": 0.11,
      "table": "Ranged_Damage",
      "duration": 5,
      "tickRate": 1
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    }
  }
};
