/**
 * Hemorrhage
 * Melee, DMG(Lethal), Foe Special DoT (Lethal), -Blood Frenzy
 *
 * Source: scrapper_melee/savage_melee/hemorrhage.json
 */

import type { Power } from '@/types';

export const Hemorrhage: Power = {
  "name": "Hemorrhage",
  "internalName": "Hemorrhage",
  "available": 21,
  "description": "You viciously tear at your foe causing a light amount of lethal damage. Additionally, the target will suffer from lethal damage over time. Hemorrhage consumes all stacks of Blood Frenzy. This power's damage over time effect will scale with the number of stacks of Blood Frenzy. Using this power with 5 stacks of Blood Frenzy causes you to become Exhausted for a short time, but the duration of Hemorrhage's damage over time effect is increased. While exhausted you cannot gain Blood Frenzy.",
  "shortHelp": "Melee, DMG(Lethal), Foe Special DoT (Lethal), -Blood Frenzy",
  "icon": "savagemelee_hemorrhage.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.76,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.351,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1638,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ]
};
