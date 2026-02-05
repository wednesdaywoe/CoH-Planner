/**
 * Telekinetic Blast
 * Ranged, DMG(Smash/Psionic), Foe Knockback
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const TelekineticBlast: Power = {
  "name": "Telekinetic Blast",
  "available": 0,
  "description": "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.",
  "shortHelp": "Ranged, DMG(Smash/Psionic), Foe Knockback",
  "icon": "fortunatatraining_telekineticblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 5.491,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
