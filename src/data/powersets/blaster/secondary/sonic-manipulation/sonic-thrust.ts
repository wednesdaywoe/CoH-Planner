/**
 * Sonic Thrust
 * Melee, DMG(Energy/Smash), Foe Knockback/Repel
 *
 * Source: blaster_support/sonic_manipulation/sonic_thrust.json
 */

import type { Power } from '@/types';

export const SonicThrust: Power = {
  "name": "Sonic Thrust",
  "internalName": "Sonic_Thrust",
  "available": 0,
  "description": "A focused attack of intense sonic power that violently sends a nearby foe flying. Deals minimal damage, but can be very effective.Damage: Minor.Recharge: Fast.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Knockback/Repel",
  "icon": "sonicmanipulation_sonicthrust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.4,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.4,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 8,
      "table": "Melee_Knockback"
    },
    "repel": {
      "scale": 4,
      "table": "Melee_Ones"
    }
  }
};
