/**
 * Fearsome Stare
 * Ranged (Cone), Foe Fear, -To Hit
 *
 * Source: defender_buff/dark_miasma/fearsome_stare.json
 */

import type { Power } from '@/types';

export const FearsomeStare: Power = {
  "name": "Fearsome Stare",
  "internalName": "Fearsome_Stare",
  "available": 11,
  "description": "Instills tremendous Fear within a cone area in front of you, causing all affected targets to tremble in Terror uncontrollably.",
  "shortHelp": "Ranged (Cone), Foe Fear, -To Hit",
  "icon": "darkmiasma_fearsomeaura.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 70,
    "arc": 0.7854,
    "recharge": 40,
    "endurance": 8.528,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Fear"
    },
    "tohitDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
