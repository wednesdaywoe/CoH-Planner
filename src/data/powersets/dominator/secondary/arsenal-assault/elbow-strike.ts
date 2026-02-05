/**
 * Elbow Strike
 * Melee, DMG(Smash), Foe Knockback
 *
 * Source: dominator_assault/arsenal_assault/heavy_blow.json
 */

import type { Power } from '@/types';

export const ElbowStrike: Power = {
  "name": "Elbow Strike",
  "internalName": "Heavy_Blow",
  "available": 9,
  "description": "You strike your foe with a powerful punch dealing Smashing damage and knocking the target back.",
  "shortHelp": "Melee, DMG(Smash), Foe Knockback",
  "icon": "assaultweapons_heavyblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.28,
    "table": "Melee_Damage"
  }
};
