/**
 * Confounding Chant
 * Ranged (Cone), DoT(Psionic), Foe Disorient
 *
 * Source: dominator_control/symphony_control/confounding_chant.json
 */

import type { Power } from '@/types';

export const ConfoundingChant: Power = {
  "name": "Confounding Chant",
  "internalName": "Confounding_Chant",
  "available": 17,
  "description": "Confounding Chant will disorient anyone that hears it, while dealing psionic damage over time. Note: this power's damage over time will extend its duration but only inflict its damage if the foe is stunned.",
  "shortHelp": "Ranged (Cone), DoT(Psionic), Foe Disorient",
  "icon": "symphonycontrol_stunaoe.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 70,
    "arc": 0.7854,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.33,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Psionic",
      "scale": 0.125,
      "table": "Ranged_Damage",
      "duration": 19.75,
      "tickRate": 1
    },
    {
      "type": "Psionic",
      "scale": 0.125,
      "table": "Ranged_Damage",
      "duration": 34.75,
      "tickRate": 1
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
