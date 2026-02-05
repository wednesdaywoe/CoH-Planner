/**
 * Fiery Embrace
 * Self +DMG
 *
 * Source: scrapper_defense/fiery_aura/fiery_embrace.json
 */

import type { Power } from '@/types';

export const FieryEmbrace: Power = {
  "name": "Fiery Embrace",
  "internalName": "Fiery_Embrace",
  "available": 27,
  "description": "Fiery Embrace causes all your damaging powers to do bonus fire damage.In PvP, this power significantly boosts the damage of all your Fire attacks for quite a while. Also increases the damage of all your other non-fire based attacks for a short while.Recharge: Long.",
  "shortHelp": "Self +DMG",
  "icon": "flamingshield_fieryembrace.png",
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
  "maxSlots": 6
};
