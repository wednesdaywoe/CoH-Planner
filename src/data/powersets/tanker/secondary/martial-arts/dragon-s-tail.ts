/**
 * Dragon's Tail
 * PBAoE Melee, DMG(Smash), Foe Knockback
 *
 * Source: tanker_melee/martial_arts/dragons_tail.json
 */

import type { Power } from '@/types';

export const DragonsTail: Power = {
  "name": "Dragon's Tail",
  "internalName": "Dragons_Tail",
  "available": 19,
  "description": "This low spinning kick deals slightly more damage than Thunder Kick, but has a chance to hit all enemies in melee range. Successful hits may trip and knock down your opponents.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Smash), Foe Knockback",
  "icon": "martialarts_monkeysweep.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 12,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 1.5,
    "maxTargets": 10
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
      "scale": 1.1818,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5319,
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
