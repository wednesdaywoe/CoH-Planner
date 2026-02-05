/**
 * Wide Area Web Grenade
 * Ranged (Targeted AoE), Immobilize, -Fly, -Recharge
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const WideAreaWebGrenade: Power = {
  "name": "Wide Area Web Grenade",
  "available": 5,
  "description": "Launches a Grenade at long range from under the barrel of your Assault rifle. It explodes into a field of sticky webs which slow and can immobilize all foes within its radius.",
  "shortHelp": "Ranged (Targeted AoE), Immobilize, -Fly, -Recharge",
  "icon": "arachnossoldier_wideareawebgrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 20,
    "endurance": 15.6,
    "castTime": 1.67,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)"
};
