/**
 * Trip Mine
 * Place Mine: PBAoE, DMG(Lethal/Fire)
 *
 * Source: defender_buff/traps/trip_mine.json
 */

import type { Power } from '@/types';

export const TripMine: Power = {
  "name": "Trip Mine",
  "internalName": "Trip_Mine",
  "available": 21,
  "description": "You can place a Trip Mine on the ground. Any foes that pass near the Trip Mine will cause it to explode, severely damaging all nearby foes and sending them flying. The Trip Mine is almost impossible to detect, but it is fragile and may be set off by an enemy's explosion. Even if destroyed, the Trip Mine will detonate. Setting a mine is delicate work, and if you are interrupted, you will fail.",
  "shortHelp": "Place Mine: PBAoE, DMG(Lethal/Fire)",
  "icon": "traps_droppedaoedamage.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "recharge": 20,
    "endurance": 13,
    "castTime": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Mine_Defender",
      "duration": 260
    }
  }
};
