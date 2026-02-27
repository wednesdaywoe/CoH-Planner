/**
 * Shocking Grasp
 * Melee, DoT (Energy), Target Hold, -End
 *
 * Source: blaster_support/electricity_manipulation/shocking_grasp.json
 */

import type { Power } from '@/types';

export const ShockingGrasp: Power = {
  "name": "Shocking Grasp",
  "internalName": "Shocking_Grasp",
  "available": 29,
  "description": "Shocking Grasp causes the target to be overcome with a violent electrical charge. The seized target is left writhing in agony and is unable to defend themselves. Shocking Grasp also drains a significant amount of Endurance from the target and may return a portion of it to you.",
  "shortHelp": "Melee, DoT (Energy), Target Hold, -End",
  "icon": "electricitymanipulation_shockinggrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 15,
    "endurance": 18.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Holds",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.3,
    "table": "Melee_Damage",
    "duration": 5.1,
    "tickRate": 1
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 9.1,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.066,
      "table": "Melee_Ones"
    }
  }
};
