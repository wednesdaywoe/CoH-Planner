/**
 * Eagles Claw
 * Melee, DMG(Smashing), Foe Minor Disorient, +Special
 *
 * Source: stalker_melee/martial_arts/eagles_claw.json
 */

import type { Power } from '@/types';

export const EaglesClaw: Power = {
  "name": "Eagles Claw",
  "internalName": "Eagles_Claw",
  "available": 25,
  "description": "You can perform a devastating smashing damage kick that can severely Disorient most opponents. Eagle's Claw has an exceptionally good critical hit capability. In addition to the normal Critical from attacking while Hidden, there is also a small chance you may land a Critical hit even if you are not Hidden.",
  "shortHelp": "Melee, DMG(Smashing), Foe Minor Disorient, +Special",
  "icon": "martialarts_eaglesclaw.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
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
    "Melee Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.92,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Stun"
    }
  }
};
