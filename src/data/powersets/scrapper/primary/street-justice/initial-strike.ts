/**
 * Initial Strike
 * Melee, DMG(Smash), Foe Disorient, Combo Builder
 *
 * Source: scrapper_melee/brawling/initial_strike.json
 */

import type { Power } from '@/types';

export const InitialStrike: Power = {
  "name": "Initial Strike",
  "internalName": "Initial_Strike",
  "available": 0,
  "description": "You deliver a pair of lightning fast blows to your opponent in an effort to throw them off balance. Initial Strike deals Light Smashing damage and has a small chance to disorient your target. Initial Strike is a Combo Builder and adds 1 Combo Level.",
  "shortHelp": "Melee, DMG(Smash), Foe Disorient, Combo Builder",
  "icon": "brawling_initialstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.8
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
      "scale": 0.42,
      "table": "Melee_Damage",
      "duration": 0.4,
      "tickRate": 0.33
    },
    {
      "type": "Smashing",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    }
  }
};
