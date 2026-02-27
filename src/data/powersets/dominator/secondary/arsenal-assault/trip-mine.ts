/**
 * Trip Mine
 * Place Mine: PBAoE, DMG(Fire), Foe Knockback
 *
 * Source: dominator_assault/arsenal_assault/trip_mine.json
 */

import type { Power } from '@/types';

export const TripMine: Power = {
  "name": "Trip Mine",
  "internalName": "Trip_Mine",
  "available": 19,
  "description": "You can place a Trip Mine on the ground. Any villains that pass near the Trip Mine will cause it to explode, damaging all nearby foes and sending them flying.",
  "shortHelp": "Place Mine: PBAoE, DMG(Fire), Foe Knockback",
  "icon": "assaultweapons_tripmine.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.93
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Mine",
      "powers": [
        "Pets.Trip_Mine_Dominator.TripMine_Resistance",
        "Pets.Trip_Mine_Dominator.TripMine_Info"
      ],
      "duration": 170
    }
  }
};
