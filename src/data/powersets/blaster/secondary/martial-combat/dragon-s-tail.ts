/**
 * Dragon's Tail
 * PBAoE Melee, Light DMG(Smash), Foe Knockdown
 *
 * Source: blaster_support/martial_manipulation/dragons_tail.json
 */

import type { Power } from '@/types';

export const DragonsTail: Power = {
  "name": "Dragon's Tail",
  "internalName": "Dragons_Tail",
  "available": 15,
  "description": "This low spinning kick deals moderate damage, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Smash), Foe Knockdown",
  "icon": "martialmanipulation_dragonstail.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 8,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 1.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.18,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.045,
      "table": "Melee_Ones"
    }
  }
};
