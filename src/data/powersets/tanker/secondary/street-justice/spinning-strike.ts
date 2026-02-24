/**
 * Spinning Strike
 * Melee (Targeted AoE), DMG(Smash), Foe Knockdown, Finisher
 *
 * Source: tanker_melee/brawling/spinning_strike.json
 */

import type { Power } from '@/types';

export const SpinningStrike: Power = {
  "name": "Spinning Strike",
  "internalName": "Spinning_Strike",
  "available": 23,
  "description": "You execute a spinning attack that first strikes with your fist and finally your heel hitting your foe and all enemies immediately nearby. Spinning Strike deals Heavy Smashing damage and has a high chance to knockdown foes. Spinning Strike is a Finisher and sets your Combo Level to 0. It will deal additional damage and will have a greater chance to knockdown dependent upon the current Combo Level. At Combo Level 3, Spinning Strike also has a moderate chance to briefly inflict Terrorize in nearby foes.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Targeted AoE), DMG(Smash), Foe Knockdown, Finisher",
  "icon": "brawling_spinningstrike.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 9,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.8,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.77,
      "table": "Melee_Damage",
      "duration": 0.45,
      "tickRate": 0.4
    },
    {
      "type": "Smashing",
      "scale": 0.8085,
      "table": "Melee_Damage",
      "duration": 0.45,
      "tickRate": 0.4
    },
    {
      "type": "Smashing",
      "scale": 0.8624,
      "table": "Melee_Damage",
      "duration": 0.45,
      "tickRate": 0.4
    },
    {
      "type": "Smashing",
      "scale": 0.9625,
      "table": "Melee_Damage",
      "duration": 0.45,
      "tickRate": 0.4
    },
    {
      "type": "Fire",
      "scale": 0.3465,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 3,
      "scale": 6,
      "table": "Melee_Fear"
    }
  }
};
