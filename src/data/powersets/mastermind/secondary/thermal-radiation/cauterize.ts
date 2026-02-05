/**
 * Cauterize
 * Ally Heal
 *
 * Source: mastermind_buff/thermal_radiation/cauterize.json
 */

import type { Power } from '@/types';

export const Cauterize: Power = {
  "name": "Cauterize",
  "internalName": "Cauterize",
  "available": 3,
  "description": "Heals a single targeted ally by cauterizing their wounds. You cannot use this power to heal yourself.",
  "shortHelp": "Ally Heal",
  "icon": "thermalradiation_cauterize.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 16.25,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 1.72,
    "table": "Ranged_Heal"
  }
};
