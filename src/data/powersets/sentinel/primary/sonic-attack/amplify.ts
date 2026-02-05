/**
 * Amplify
 * Self +To Hit, +DMG, +Range
 *
 * Source: sentinel_ranged/sonic_attack/amplify.json
 */

import type { Power } from '@/types';

export const Amplify: Power = {
  "name": "Amplify",
  "internalName": "Amplify",
  "available": 7,
  "description": "Greatly increases your chance to hit with attacks for a few seconds. Slightly increases damage.",
  "shortHelp": "Self +To Hit, +DMG, +Range",
  "icon": "sonicblast_aim.png",
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
    "Ranged Damage",
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 5,
      "table": "Melee_Buff_ToHit"
    },
    "rangeBuff": {
      "scale": 0.333,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
