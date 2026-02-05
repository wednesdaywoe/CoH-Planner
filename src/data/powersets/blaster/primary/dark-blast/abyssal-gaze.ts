/**
 * Abyssal Gaze
 * Ranged, DoT(Negative), Foe Hold, -To Hit
 *
 * Source: blaster_ranged/dark_blast/abyssal_gaze.json
 */

import type { Power } from '@/types';

export const AbyssalGaze: Power = {
  "name": "Abyssal Gaze",
  "internalName": "Abyssal_Gaze",
  "available": 17,
  "description": "You gaze into your foe's eyes giving them a glimpse into the terrifying netherworld rendering them held, reducing their chance to hit and dealing High Negative Energy damage over the next couple of seconds.",
  "shortHelp": "Ranged, DoT(Negative), Foe Hold, -To Hit",
  "icon": "darkcast_abyssalgaze.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
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
    "Holds",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.707,
    "table": "Ranged_Damage",
    "duration": 2.1,
    "tickRate": 1
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    },
    "hold": {
      "mag": 3,
      "scale": 4.4,
      "table": "Ranged_Immobilize"
    }
  }
};
