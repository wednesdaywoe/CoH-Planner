/**
 * Toxins
 * Self +ToHit, +DMG(Special)
 *
 * Source: blaster_support/plant_manipulation/toxins.json
 */

import type { Power } from '@/types';

export const Toxins: Power = {
  "name": "Toxins",
  "internalName": "Toxins",
  "available": 9,
  "description": "You use your power over plants to coat all your attacks with powerful toxins for a few seconds, all your attacks will now do extra toxic damage and be more accurate.Recharge: Long.",
  "shortHelp": "Self +ToHit, +DMG(Special)",
  "icon": "plantmanipulation_toxins.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    }
  }
};
