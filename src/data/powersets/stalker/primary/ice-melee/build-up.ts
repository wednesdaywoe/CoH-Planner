/**
 * Build Up
 * Self +DMG, +To Hit, +Special
 *
 * Source: stalker_melee/ice_melee/build_up.json
 */

import type { Power } from '@/types';

export const BuildUp: Power = {
  "name": "Build Up",
  "internalName": "Build_Up",
  "available": 11,
  "description": "Burmal lowers the temperature of your hands even further, making all your icy attacks do additional cold damage over time. It also greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your Accuracy.",
  "shortHelp": "Self +DMG, +To Hit, +Special",
  "icon": "icyonslaught_followup.png",
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
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 8,
      "table": "Melee_Buff_Dmg"
    }
  }
};
