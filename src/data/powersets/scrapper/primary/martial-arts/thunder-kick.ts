/**
 * Thunder Kick
 * Melee, DMG(Smash), Minor Disorient
 *
 * Source: scrapper_melee/martial_arts/thunder_kick.json
 */

import type { Power } from '@/types';

export const ThunderKick: Power = {
  "name": "Thunder Kick",
  "internalName": "Thunder_Kick",
  "available": 0,
  "description": "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.",
  "shortHelp": "Melee, DMG(Smash), Minor Disorient",
  "icon": "martialarts_thunderkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
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
      "scale": 0.84,
      "table": "Melee_Damage"
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
