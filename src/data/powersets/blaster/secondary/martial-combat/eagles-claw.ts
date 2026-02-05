/**
 * Eagles Claw
 * Melee, Extreme DMG(Smash), DoT(Lethal), Foe Minor Disorient, +Special
 *
 * Source: blaster_support/martial_manipulation/eagles_claw.json
 */

import type { Power } from '@/types';

export const EaglesClaw: Power = {
  "name": "Eagles Claw",
  "internalName": "Eagles_Claw",
  "available": 29,
  "description": "You can perform a devastating kick that can severely Disorient most opponents. Eagle's Claw strikes so powerfully that it weakens your target's resolve, reducing their Range and Recharge for several seconds after attacking, and has an additional chance to cause your target to bleed for Lethal damage over time.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Smash), DoT(Lethal), Foe Minor Disorient, +Special",
  "icon": "martialmanipulation_eaglesclaw.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 2.53
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 3.24,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.5,
      "table": "Melee_Damage",
      "duration": 5,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Melee_Stun"
    },
    "rangeBuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "rechargeDebuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.167,
      "table": "Melee_Ones"
    }
  }
};
