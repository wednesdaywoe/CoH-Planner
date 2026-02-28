/**
 * Shatter
 * Melee, Extreme DMG(Smash), Minor DoT(Toxic), Foe High Knockback
 */

import type { Power } from '@/types';

export const Shatter: Power = {
  "name": "Shatter",
  "available": 17,
  "description": "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal extreme damage and can knock foes back a great ways. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: Extreme",
  "shortHelp": "Melee, Extreme DMG(Smash), Minor DoT(Toxic), Foe High Knockback",
  "icon": "banespider_shatter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 14,
    "endurance": 15.184,
    "castTime": 2.33
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.76,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
