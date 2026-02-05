/**
 * Inky Aspect
 * PBAoE, Foe Disorient, Self -HP
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const InkyAspect: Power = {
  "name": "Inky Aspect",
  "available": 27,
  "description": "Inky Aspect allows you to sacrifice some of your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use.  Recharge: Moderate.",
  "shortHelp": "PBAoE, Foe Disorient, Self -HP",
  "icon": "umbralaura_inkyaspect.png",
  "powerType": "Toggle",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 8,
    "endurance": 0.156,
    "castTime": 1.17,
    "radius": 8,
    "maxTargets": 10
  },
  "targetType": "Self"
};
