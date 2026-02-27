/**
 * Power Thrust
 * Melee, Minor DMG(Energy/Smash), Foe Knockback
 *
 * Source: blaster_support/energy_manipulation/power_thrust.json
 */

import type { Power } from '@/types';

export const PowerThrust: Power = {
  "name": "Power Thrust",
  "internalName": "Power_Thrust",
  "available": 0,
  "description": "A focused attack that violently shoves the target and sends them flying. Deals minimal damage, but can be very effective.Damage: Minor.Recharge: Fast.",
  "shortHelp": "Melee, Minor DMG(Energy/Smash), Foe Knockback",
  "icon": "energymanipulation_powerthrust.png",
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
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
