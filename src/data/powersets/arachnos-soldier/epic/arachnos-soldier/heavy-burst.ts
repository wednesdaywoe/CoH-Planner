/**
 * Heavy Burst
 * Ranged Cone, Moderate DMG(Lethal), Foe -DEF
 *
 * Source: arachnos_soldiers/arachnos_soldier/heavy_burst.json
 */

import type { Power } from '@/types';

export const HeavyBurst: Power = {
  "name": "Heavy Burst",
  "available": 7,
  "description": "Fires a Heavy Burst of rounds at foes in a long cone in front of the user. Can also reduce the targets' defense. Damage: Moderate(DoT)",
  "shortHelp": "Ranged Cone, Moderate DMG(Lethal), Foe -DEF",
  "icon": "arachnossoldier_heavyburst.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 50,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.5,
    "radius": 50,
    "arc": 0.5236,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
