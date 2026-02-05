/**
 * Mental Blast
 * Ranged, DMG(Psionic), Target -Recharge
 *
 * Source: arachnos-widow/night-widow-training
 */

import type { Power } from '@/types';

export const MentalBlast: Power = {
  "name": "Mental Blast",
  "available": 0,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.",
  "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
  "icon": "nightwidowtraining_mentalblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 7.232,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
