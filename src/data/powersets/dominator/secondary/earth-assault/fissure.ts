/**
 * Fissure
 * Close (Targeted AoE), Light DMG(Smash), Foe Knockback, Disorient
 *
 * Source: dominator_assault/earth_assault/fissure.json
 */

import type { Power } from '@/types';

export const Fissure: Power = {
  "name": "Fissure",
  "internalName": "Fissure",
  "available": 29,
  "description": "This powerful stomp can crack the earth itself, damaging a nearby targeted foe and any foes around it. This Fissure can only affect foes on the ground, dealing moderate smashing damage and possibly throwing them into the air or disorienting them.Damage: Light.Recharge: Slow.",
  "shortHelp": "Close (Targeted AoE), Light DMG(Smash), Foe Knockback, Disorient",
  "icon": "earthassault_fissure.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 20,
    "radius": 10,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.17,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    },
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
