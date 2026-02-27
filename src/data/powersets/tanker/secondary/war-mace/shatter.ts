/**
 * Shatter
 * Melee (Cone), DMG(Smashing), Knockback
 *
 * Source: tanker_melee/war_mace/shatter.json
 */

import type { Power } from '@/types';

export const Shatter: Power = {
  "name": "Shatter",
  "internalName": "Shatter",
  "available": 27,
  "description": "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal great damage and can knock foes back a great ways. The power of this attack can actually extend a short distance through multiple foes.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
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
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
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
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
