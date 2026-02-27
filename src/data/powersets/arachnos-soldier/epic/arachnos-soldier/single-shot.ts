/**
 * Single Shot
 * Ranged, Minor DMG(Lethal), Foe -DEF
 *
 * Source: arachnos_soldiers/arachnos_soldier/single_shot.json
 */

import type { Power } from '@/types';

export const SingleShot: Power = {
  "name": "Single Shot",
  "available": 0,
  "description": "A quick single shot from the Arachnos Sub-machinegun. Extremely accurate. Damage: Minor",
  "shortHelp": "Ranged, Minor DMG(Lethal), Foe -DEF",
  "icon": "arachnossoldier_singleshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 0.9
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
