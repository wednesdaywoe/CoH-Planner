/**
 * Jack Frost
 * Summon Jack Frost: Melee DMG(Lethal/Cold)
 *
 * Source: dominator_control/ice_control/jack_frost.json
 */

import type { Power } from '@/types';

export const JackFrost: Power = {
  "name": "Jack Frost",
  "internalName": "Jack_Frost",
  "available": 25,
  "description": "You can create a very powerful entity of animated ice at a targeted location. Jack Frost possesses several ice powers to attack any nearby foes and can be healed and buffed like any teammate.",
  "shortHelp": "Summon Jack Frost: Melee DMG(Lethal/Cold)",
  "icon": "iceformation_jackfrost.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 20.8,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_JackFrost"
    }
  }
};
