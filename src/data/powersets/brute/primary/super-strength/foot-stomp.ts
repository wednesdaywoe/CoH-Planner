/**
 * Foot Stomp
 * PBAoE Melee, DMG(Smashing), Knockback
 *
 * Source: brute_melee/super_strength/foot_stomp.json
 */

import type { Power } from '@/types';

export const FootStomp: Power = {
  "name": "Foot Stomp",
  "internalName": "Foot_Stomp",
  "available": 25,
  "description": "Using your superior leg strength, you can Stomp your foot to the ground, quaking the earth itself. This is a localized attack against everything in melee range.",
  "shortHelp": "PBAoE Melee, DMG(Smashing), Knockback",
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
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
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
