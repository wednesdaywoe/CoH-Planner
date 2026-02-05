/**
 * Aimed Shot
 * Ranged, DMG(Lethal)
 *
 * Source: blaster_ranged/archery/aimed_shot.json
 */

import type { Power } from '@/types';

export const AimedShot: Power = {
  "name": "Aimed Shot",
  "internalName": "Aimed_Shot",
  "available": 0,
  "description": "Though it takes longer to execute, your Aimed Shot deals greater damage than Snap Shot.",
  "shortHelp": "Ranged, DMG(Lethal)",
  "icon": "archery_mediumarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 80,
    "recharge": 6,
    "endurance": 5.2,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.32,
    "table": "Ranged_Damage"
  },
  "effects": {
    "damageBuff": {
      "scale": 0.11,
      "table": "Ranged_Ones"
    }
  }
};
