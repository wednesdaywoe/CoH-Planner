/**
 * Single Shot
 * Ranged, Minor DMG(Lethal), Foe -DEF
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const SingleShot: Power = {
  "name": "Single Shot",
  "available": 0,
  "description": "A quick single shot from the Arachnos Sub-machinegun. Extremely accurate. Damage: Minor",
  "shortHelp": "Ranged, Minor DMG(Lethal), Foe -DEF",
  "icon": "arachnossoldier_singleshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 0.9
  },
  "targetType": "Foe (Alive)"
};
