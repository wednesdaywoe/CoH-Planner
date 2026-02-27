/**
 * Savage Strike
 * Melee, DMG(Lethal), Foe DoT (Lethal), Self +1 Blood Frenzy
 *
 * Source: tanker_melee/savage_melee/savage_strike.json
 */

import type { Power } from '@/types';

export const SavageStrike: Power = {
  "name": "Savage Strike",
  "internalName": "Savage_Strike",
  "available": 0,
  "description": "You quickly tear at your foe dealing minor lethal damage and causing minor lethal damage over time. Savage Strikes grants you 1 stack of Blood Frenzy.",
  "shortHelp": "Melee, DMG(Lethal), Foe DoT (Lethal), Self +1 Blood Frenzy",
  "icon": "savagemelee_savagestrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 2.5,
    "endurance": 3.95,
    "castTime": 0.8
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.38,
      "table": "Melee_Damage",
      "duration": 0.4,
      "tickRate": 0.35
    },
    {
      "type": "Fire",
      "scale": 0.171,
      "table": "Melee_Damage",
      "duration": 0.4,
      "tickRate": 0.35
    }
  ]
};
