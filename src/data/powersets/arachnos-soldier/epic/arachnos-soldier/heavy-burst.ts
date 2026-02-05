/**
 * Heavy Burst
 * Ranged Cone, Moderate DMG(Lethal), Foe -DEF
 *
 * Source: arachnos-soldier/arachnos-soldier
 */

import type { Power } from '@/types';

export const HeavyBurst: Power = {
  "name": "Heavy Burst",
  "available": 7,
  "description": "Fires a Heavy Burst of rounds at foes in a long cone in front of the user. Can also reduce the targets' defense. Damage: Moderate(DoT)",
  "shortHelp": "Ranged Cone, Moderate DMG(Lethal), Foe -DEF",
  "icon": "arachnossoldier_heavyburst.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "range": 50,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.5,
    "radius": 50,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)"
};
