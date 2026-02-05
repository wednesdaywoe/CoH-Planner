/**
 * Embrace of Fire
 * Self +DMG
 *
 * Source: dominator_assault/fiery_assault/fiery_embrace.json
 */

import type { Power } from '@/types';

export const EmbraceofFire: Power = {
  "name": "Embrace of Fire",
  "internalName": "Fiery_Embrace",
  "available": 15,
  "description": "Significantly boosts the damage of all your Fire attacks for quite a while. Also increases the damage of all your other non-fire based attacks for a short while.Recharge: Long.",
  "shortHelp": "Self +DMG",
  "icon": "fireassault_fieryembrace.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 180,
    "endurance": 7.8,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 8,
      "table": "Melee_Buff_Dmg"
    }
  }
};
