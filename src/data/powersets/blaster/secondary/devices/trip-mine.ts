/**
 * Trip Mine
 * Place Mine: PBAoE, Superior DMG(Lethal/Fire), Foe Knockback
 *
 * Source: blaster_support/gadgets/trip_mine.json
 */

import type { Power } from '@/types';

export const TripMine: Power = {
  "name": "Trip Mine",
  "internalName": "Trip_Mine",
  "available": 23,
  "description": "You can place a Trip Mine on the ground. Any villains that pass near the Trip Mine will cause it to explode, severely damaging all nearby foes and sending them flying. The Trip Mine is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trip Mine will detonate.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Place Mine: PBAoE, Superior DMG(Lethal/Fire), Foe Knockback",
  "icon": "gadgets_mine.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 30,
    "endurance": 13,
    "castTime": 2.77
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Mine",
      "duration": 260
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
