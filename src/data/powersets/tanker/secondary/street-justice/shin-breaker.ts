/**
 * Shin Breaker
 * Melee, DMG(Smash), Foe -Speed, -Defense, Combo Builder
 *
 * Source: tanker_melee/brawling/low_kick.json
 */

import type { Power } from '@/types';

export const ShinBreaker: Power = {
  "name": "Shin Breaker",
  "internalName": "Low_Kick",
  "available": 27,
  "description": "You execute a quick but powerful kick targeting your foe's leg in an attempt to cripple their movement. Shin Breaker deals Superior Smashing damage and moderately reduces your target's movement speed and defense for a short time. Shin Breaker is a Combo Builder and adds 1 Combo Level.",
  "shortHelp": "Melee, DMG(Smash), Foe -Speed, -Defense, Combo Builder",
  "icon": "brawling_lowkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Slow",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "Melee Damage",
    "Slow Movement",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.64,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.738,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Melee_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
