/**
 * Restore Essence
 * Self Rez
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const RestoreEssence: Power = {
  "name": "Restore Essence",
  "available": 29,
  "description": "Should you fall in battle, you can Restore your Essence and bring yourself from the brink of death. You will revive with most of your Hit Points and half your Endurance and be protected from XP Debt for 90 seconds.  Recharge: Very Long.",
  "shortHelp": "Self Rez",
  "icon": "luminousaura_restoreessence.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "castTime": 1.5
  },
  "targetType": "Self"
};
