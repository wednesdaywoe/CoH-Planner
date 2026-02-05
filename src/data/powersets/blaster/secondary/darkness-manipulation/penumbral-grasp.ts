/**
 * Penumbral Grasp
 * Ranged, Moderate DOT(Negative), Foe Immobilize, -To Hit
 *
 * Source: blaster_support/darkness_manipulation/penumbral_grasp.json
 */

import type { Power } from '@/types';

export const PenumbralGrasp: Power = {
  "name": "Penumbral Grasp",
  "internalName": "Penumbral_Grasp",
  "available": 0,
  "description": "Penumbral Grasp deals moderate Negative Energy damage, reduces their chance to hit and may leave the targeted foe Immobilized for a brief time. Immobilized foes cannot move but can still attack.",
  "shortHelp": "Ranged, Moderate DOT(Negative), Foe Immobilize, -To Hit",
  "icon": "darknessmanipulation_penumbralgrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Blaster Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "damageBuff": {
      "scale": 0.11,
      "table": "Ranged_Ones"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
