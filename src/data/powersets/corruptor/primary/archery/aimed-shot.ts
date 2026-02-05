/**
 * Aimed Shot
 * Ranged, High DMG(Lethal)
 *
 * Source: corruptor_ranged/archery/aimed_shot.json
 */

import type { Power } from '@/types';

export const AimedShot: Power = {
  "name": "Aimed Shot",
  "internalName": "Aimed_Shot",
  "available": 0,
  "description": "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.Damage: High.Recharge: Fast.",
  "shortHelp": "Ranged, High DMG(Lethal)",
  "icon": "archery_mediumarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ]
};
