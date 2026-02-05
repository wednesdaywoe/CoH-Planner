/**
 * Future Pain
 * Melee, DMG(Psionic), Foe Fear
 *
 * Source: blaster_support/time_manipulation/future_pain.json
 */

import type { Power } from '@/types';

export const FuturePain: Power = {
  "name": "Future Pain",
  "internalName": "Future_Pain",
  "available": 23,
  "description": "You lay your hands on your foe dig into his future timeline for the most painful experience the foe will ever go through and plant those memories on his present mind inflicting great psionic damage. The visions of this pain may be enough to make your foe cower in fear. Targets affected by the Delayed effect will suffer a more terrifying experience.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, DMG(Psionic), Foe Fear",
  "icon": "timemanipulation_futurepain.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Fear",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Fear",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 3.24,
    "table": "Melee_Damage"
  },
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Fear"
    },
    "damageBuff": {
      "scale": 0.11,
      "table": "Melee_Ones"
    }
  }
};
