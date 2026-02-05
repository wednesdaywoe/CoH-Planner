/**
 * Darkest Night
 * Toggle: Ranged (Targeted AoE), Foe -DMG -To Hit
 *
 * Source: defender_buff/dark_miasma/darkest_night.json
 */

import type { Power } from '@/types';

export const DarkestNight: Power = {
  "name": "Darkest Night",
  "internalName": "Darkest_Night",
  "available": 1,
  "description": "While active, you channel Negative Energy onto a targeted foe. Darkest Night decreases the damage potential and chance to hit of the target, and all foes nearby, as long as you keep the power active.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG -To Hit",
  "icon": "darkmiasma_darkestnight.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 25,
    "recharge": 10,
    "endurance": 0.26,
    "castTime": 3.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Dam"
    },
    "tohitDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
