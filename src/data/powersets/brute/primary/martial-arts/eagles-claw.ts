/**
 * Eagles Claw
 * Melee, DMG(Smash), Foe Minor Disorient, +DMG(All)
 *
 * Source: brute_melee/martial_arts/eagles_claw.json
 */

import type { Power } from '@/types';

export const EaglesClaw: Power = {
  "name": "Eagles Claw",
  "internalName": "Eagles_Claw",
  "available": 25,
  "description": "You can perform a devastating kick that can severely Disorient most opponents. After using Eagle's Claw your damage will be increased for a brief moment allowing the next attack or two to cause additional damage.",
  "shortHelp": "Melee, DMG(Smash), Foe Minor Disorient, +DMG(All)",
  "icon": "martialarts_eaglesclaw.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 12,
    "endurance": 11.856,
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
    "Brute Archetype Sets",
    "Melee Damage",
    "Stuns",
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
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Melee_Stun"
    },
    "damageBuff": {
      "scale": 3.3,
      "table": "Melee_Buff_Dmg"
    }
  }
};
