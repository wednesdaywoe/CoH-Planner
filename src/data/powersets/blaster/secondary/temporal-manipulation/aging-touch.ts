/**
 * Aging Touch
 * Melee, DMG(Psionic), DoT(Psionic), Foe -End Over Time
 *
 * Source: blaster_support/time_manipulation/aging_touch.json
 */

import type { Power } from '@/types';

export const AgingTouch: Power = {
  "name": "Aging Touch",
  "internalName": "Aging_Touch",
  "available": 0,
  "description": "You touch an enemy and accelerate their aging process causing exhaustion and psionic damage. Affected enemies will continue to age for a limited time, and suffering psionic damage over time. Targets affected by the Delayed effect will suffer from additional psionic damage over time.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, DMG(Psionic), DoT(Psionic), Foe -End Over Time",
  "icon": "timemanipulation_agingtouch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Psionic",
      "scale": 1.02,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Psionic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.028,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.066,
      "table": "Melee_Ones"
    }
  }
};
