/**
 * Strident Echo
 * Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold
 *
 * Source: scrapper_melee/sonic_melee/strident_echo.json
 */

import type { Power } from '@/types';

export const StridentEcho: Power = {
  "name": "Strident Echo",
  "internalName": "Strident_Echo",
  "available": 0,
  "description": "Strident Echo deals minor damage over time. It has a low chance of causing a migraine, leaving the target shaking in pain and helpless. This power will inflict a strong additional damage over time effect for 25 seconds against Attuned targets.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Res(Debuffs), Chance for Hold",
  "icon": "sonicmanipulation_stridentecho.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.22,
    "table": "Melee_Damage",
    "duration": 2.1,
    "tickRate": 0.4
  }
};
