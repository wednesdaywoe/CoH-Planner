/**
 * Shatter
 * Melee (Cone), DMG(Smashing), Knockback
 *
 * Source: scrapper_melee/war_mace/shatter.json
 */

import type { Power } from '@/types';

export const Shatter: Power = {
  "name": "Shatter",
  "internalName": "Shatter",
  "available": 21,
  "description": "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal great damage and can knock foes back a great ways. The power of this attack can actually extend a short distance through multiple foes.",
  "shortHelp": "Melee (Cone), DMG(Smashing), Knockback",
  "icon": "mace_shatter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 8,
    "radius": 8,
    "arc": 0.7854,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.33,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.28,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.026,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 2.28,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 2.28,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
