/**
 * Seishinteki Kyoyo
 * Self +Endurance
 *
 * Source: scrapper_defense/ninjitsu/seishinteki_kyoyo.json
 */

import type { Power } from '@/types';

export const SeishintekiKyoyo: Power = {
  "name": "Seishinteki Kyoyo",
  "internalName": "Seishinteki_Kyoyo",
  "available": 15,
  "description": "Seishinteki Kyoyo is the spiritual education in Ninjitsu. Your mastery of these spiritual techniques allow you to recover endurance with a short period of meditation.Recharge: Slow.",
  "shortHelp": "Self +Endurance",
  "icon": "ninjitsu_recovery.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 0.3,
      "table": "Melee_Ones"
    }
  }
};
