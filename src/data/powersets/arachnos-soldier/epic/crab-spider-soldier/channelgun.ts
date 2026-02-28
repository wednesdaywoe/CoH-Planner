/**
 * Channelgun
 * Ranged, Moderate DMG(Energy), Foe -DEF
 */

import type { Power } from '@/types';

export const Channelgun: Power = {
  "name": "Channelgun",
  "available": 0,
  "description": "Your Crab Spider backpack is equipped with a powerful energy Channelgun. This ranged attack deals moderate Energy damage and can reduce the target's Defense. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DMG(Energy), Foe -DEF",
  "icon": "crabspider_channelgun.png",
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
    "accuracy": 1,
    "range": 80,
    "recharge": 5,
    "endurance": 8.12,
    "castTime": 1
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 1.16,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
