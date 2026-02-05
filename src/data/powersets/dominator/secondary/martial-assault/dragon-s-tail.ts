/**
 * Dragon's Tail
 * PBAoE Melee, Light DMG(Smash), Foe Knockdown
 *
 * Source: dominator_assault/martial_assault/dragons_tail.json
 */

import type { Power } from '@/types';

export const DragonsTail: Power = {
  "name": "Dragon's Tail",
  "internalName": "Dragons_Tail",
  "available": 19,
  "description": "This low spinning kick deals less damage than Thunder Kick, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Smash), Foe Knockdown",
  "icon": "martialmanipulation_dragonstail.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
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
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.8985,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
