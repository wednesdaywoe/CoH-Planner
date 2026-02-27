/**
 * Mental Blast
 * Ranged, DMG(Psionic), Target -Recharge
 *
 * Source: widow_training/fortunata_training/frt_mental_blast.json
 */

import type { Power } from '@/types';

export const MentalBlast: Power = {
  "name": "Mental Blast",
  "available": 0,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.",
  "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
  "icon": "fortunatatraining_mentalblast.png",
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
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Psionic",
    "scale": 1.3908,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
