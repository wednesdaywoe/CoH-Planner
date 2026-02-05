/**
 * Dart Burst
 * Ranged Cone, DMG(Lethal), DoT(Toxic), -Regeneration
 *
 * Source: arachnos-widow/widow-training
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
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
