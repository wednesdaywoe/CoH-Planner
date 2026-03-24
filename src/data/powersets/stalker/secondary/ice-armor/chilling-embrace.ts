/**
 * Chilling Embrace
 * Toggle: PBAoE, Foe -Recharge, -Speed, -DMG
 *
 * Source: stalker_defense/ice_armor/chilling_embrace.json
 */

import type { Power } from '@/types';

export const ChillingEmbrace: Power = {
  "name": "Chilling Embrace",
  "internalName": "Chilling_Embrace",
  "available": 15,
  "description": "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their movement speed and damage.",
  "shortHelp": "Toggle: PBAoE, Foe -Recharge, -Speed, -DMG",
  "icon": "icearmor_chillingembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73,
    "activatePeriod": 0.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6
};
