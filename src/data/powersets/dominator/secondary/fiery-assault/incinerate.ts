/**
 * Incinerate
 * Melee, High DoT(Fire)
 *
 * Source: dominator_assault/fiery_assault/incinerate.json
 */

import type { Power } from '@/types';

export const Incinerate: Power = {
  "name": "Incinerate",
  "internalName": "Incinerate",
  "available": 0,
  "description": "Intense concentration can allow you to Incinerate an opponent at melee range. This will set your foe ablaze, dealing damage over time.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DoT(Fire)",
  "icon": "fireassault_incinerate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.212,
    "table": "Melee_Damage",
    "duration": 4.6,
    "tickRate": 0.5
  }
};
