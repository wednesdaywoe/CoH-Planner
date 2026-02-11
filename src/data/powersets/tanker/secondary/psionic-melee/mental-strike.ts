/**
 * Mental Strike
 * Melee, DMG(Psionic/Smash), Foe -Rech; Self +Insight
 *
 * Source: tanker_melee/psionic_melee/mental_strike.json
 */

import type { Power } from '@/types';

export const MentalStrike: Power = {
  "name": "Mental Strike",
  "internalName": "Mental_Strike",
  "available": 0,
  "description": "You project psionic energy around your fist and strike at your foe dealing light Psionic and Smashing damage. Affected foes will have their recharge rate reduced. Mental Strike has a small chance to grant you Insight. While you have Insight, Mental Strike will deal additional minor psionic damage over time.",
  "shortHelp": "Melee, DMG(Psionic/Smash), Foe -Rech; Self +Insight",
  "icon": "psionicmelee_mentalstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1
  },
  "allowedEnhancements": [
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
      "type": "Smashing",
      "scale": 0.21,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.63,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.0661,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    }
  }
};
