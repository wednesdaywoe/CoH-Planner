/**
 * Cobra Strike
 * Melee, DMG(Smash), Foe Disorient
 *
 * Source: scrapper_melee/martial_arts/cobra_strike.json
 */

import type { Power } from '@/types';

export const CobraStrike: Power = {
  "name": "Cobra Strike",
  "internalName": "Cobra_Strike",
  "available": 1,
  "description": "Using intense martial arts focus, you can perform a Cobra Strike that deals high damage, but has a great chance of Disorienting your target.",
  "shortHelp": "Melee, DMG(Smash), Foe Disorient",
  "icon": "martialarts_cobrastrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67
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
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.882,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Stun"
    }
  }
};
