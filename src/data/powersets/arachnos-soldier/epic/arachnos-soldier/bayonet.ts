/**
 * Bayonet
 * Melee, Moderate DMG(Lethal), DoT(Lethal)
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const Bayonet: Power = {
  "name": "Bayonet",
  "available": 11,
  "description": "Your weapon includes a bayonet attachment which you can use to stab at your enemies for lethal damage as well as causing them to bleed losing health over time. NOTE: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Bane Spider Cloaking Device. Damage: Moderate",
  "shortHelp": "Melee, Moderate DMG(Lethal), DoT(Lethal)",
  "icon": "arachnossoldier_bayonet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
