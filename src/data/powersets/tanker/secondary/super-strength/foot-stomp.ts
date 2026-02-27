/**
 * Foot Stomp
 * PBAoE Melee, DMG(Smash), Knockback
 *
 * Source: tanker_melee/super_strength/foot_stomp.json
 */

import type { Power } from '@/types';

export const FootStomp: Power = {
  "name": "Foot Stomp",
  "internalName": "Foot_Stomp",
  "available": 29,
  "description": "Using your superior leg strength, you can Stomp your foot to the ground, quaking the earth itself. This is a localized attack against everything in melee range.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Smash), Knockback",
  "icon": "superstrength_footstomp.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.1,
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
      "scale": 1.42,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.639,
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
