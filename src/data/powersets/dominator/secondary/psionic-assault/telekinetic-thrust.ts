/**
 * Telekinetic Thrust
 * Melee, Moderate DMG(Psionic/Smash), Foe Knockback
 *
 * Source: dominator_assault/psionic_assault/telekinetic_thrust.json
 */

import type { Power } from '@/types';

export const TelekineticThrust: Power = {
  "name": "Telekinetic Thrust",
  "internalName": "Telekinetic_Thrust",
  "available": 3,
  "description": "A focused attack of intense mental power that violently sends a nearby foe flying and deals a high amount of Psionic and Smashing damage.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, Moderate DMG(Psionic/Smash), Foe Knockback",
  "icon": "psionicassault_telekineticthrust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 7,
    "endurance": 7.696,
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
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.37,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1.11,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 8,
      "table": "Melee_Knockback"
    }
  }
};
