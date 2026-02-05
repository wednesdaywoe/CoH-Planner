/**
 * Whirlpool
 * Ranged (Location AoE), DoT(Cold), -Speed, -Defense, +Wet, Self +Tidal Power
 *
 * Source: defender_ranged/water_blast/whirlpool.json
 */

import type { Power } from '@/types';

export const Whirlpool: Power = {
  "name": "Whirlpool",
  "internalName": "Whirlpool",
  "available": 9,
  "description": "You create a violent whirlpool at the target location causing Cold damage over time, reducing the targets' speed and defense for a short time. Whirlpool grants 1 stack of Tidal Power.",
  "shortHelp": "Ranged (Location AoE), DoT(Cold), -Speed, -Defense, +Wet, Self +Tidal Power",
  "icon": "waterblast_whirlpool.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Whirlpool_Defender",
      "duration": 15
    }
  }
};
