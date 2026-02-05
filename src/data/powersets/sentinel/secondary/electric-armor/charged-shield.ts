/**
 * Charged Shield
 * Toggle: Self +Regen, +MaxEnd
 *
 * Source: sentinel_defense/electric_armor/charged_shield.json
 */

import type { Power } from '@/types';

export const ChargedShield: Power = {
  "name": "Charged Shield",
  "internalName": "Charged_Shield",
  "available": 0,
  "description": "When you toggle on this power, you charge up every particle in your body increasing your regeneration rate and increasing your max endurance. Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Regen, +MaxEnd",
  "icon": "electricarmor_chargedshield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.104,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxEndBuff": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    }
  }
};
