/**
 * Telekinetic Thrust
 * Melee, Superior DMG(Psionic/Smash), Foe Knockback
 *
 * Source: blaster_support/mental_manipulation/telekinetic_thrust.json
 */

import type { Power } from '@/types';

export const TelekineticThrust: Power = {
  "name": "Telekinetic Thrust",
  "internalName": "Telekinetic_Thrust",
  "available": 29,
  "description": "A focused attack of intense mental power that violently sends a nearby foe flying. Deals minimal damage, but can be very effective.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Psionic/Smash), Foe Knockback",
  "icon": "psionicassault_telekineticthrust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
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
      "scale": 1.46,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1.46,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 8,
      "table": "Melee_Knockback"
    },
    "damageBuff": {
      "scale": 0.137,
      "table": "Melee_Ones"
    }
  }
};
