/**
 * Cauterizing Blaze
 * Toggle: Self +Heal Over Time
 *
 * Source: stalker_defense/fiery_aura/cauterizing_blaze.json
 */

import type { Power } from '@/types';

export const CauterizingBlaze: Power = {
  "name": "Cauterizing Blaze",
  "internalName": "Cauterizing_Blaze",
  "available": 27,
  "description": "While active, you are surrounded by flames cauterize your wounds healing you a small amount every few seconds.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Heal Over Time",
  "icon": "flamingshield_cauterizing.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.13,
    "castTime": 2.03
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
  "damage": {
    "type": "Heal",
    "scale": 0.075,
    "table": "Melee_HealSelf"
  }
};
