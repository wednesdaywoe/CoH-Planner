/**
 * Placate
 * Melee, Foe Placate, Self Hide
 */

import type { Power } from '@/types';

export const Placate: Power = {
  "name": "Placate",
  "available": 21,
  "description": "Allows you to trick a foe to no longer attack you. A successful Placate will also Hide you. The Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit. However, if you attack a Placated Foe, he will be able to attack you back. Recharge: Long",
  "shortHelp": "Melee, Foe Placate, Self Hide",
  "icon": "banespider_placate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Taunt"
  ],
  "allowedSetCategories": [
    "Soldiers of Arachnos Archetype Sets",
    "Threat Duration"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
