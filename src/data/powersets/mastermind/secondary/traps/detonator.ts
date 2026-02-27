/**
 * Detonator
 * Sacrifice Henchman, PBAoE, Extreme DMG(Lethal/Fire), Foe Knockback
 *
 * Source: mastermind_buff/traps/detonator.json
 */

import type { Power } from '@/types';

export const Detonator: Power = {
  "name": "Detonator",
  "internalName": "Detonator",
  "available": 29,
  "description": "A good Mastermind always plans ahead, but a great one knows when to make a strategic sacrifice. You have equipped all your Henchmen with explosives. When the time is right, select a Henchman and set off the Detonator. Recharge: Very Long.",
  "shortHelp": "Sacrifice Henchman, PBAoE, Extreme DMG(Lethal/Fire), Foe Knockback",
  "icon": "traps_aoemassivedamage.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 300,
    "endurance": 16.31,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
