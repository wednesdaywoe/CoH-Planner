/**
 * Burst
 * Ranged, Moderate DMG(Lethal), Foe -DEF
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const Burst: Power = {
  "name": "Burst",
  "available": 1,
  "description": "Quickly fires a Burst of rounds at a single target at long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense. Damage: Moderate(DoT)",
  "shortHelp": "Ranged, Moderate DMG(Lethal), Foe -DEF",
  "icon": "arachnossoldier_burst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
