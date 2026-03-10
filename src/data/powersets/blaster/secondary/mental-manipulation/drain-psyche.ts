/**
 * Drain Psyche
 * PBAoE Foe -Regen, -Recovery; Self +Regen, +Recovery
 *
 * Source: blaster_support/mental_manipulation/drain_psyche.json
 */

import type { Power } from '@/types';

export const DrainPsyche: Power = {
  "name": "Drain Psyche",
  "internalName": "Drain_Psyche",
  "available": 19,
  "description": "You Drain the Psyche of nearby foes, thus weakening their Hit Point Regeneration and Endurance Recovery and boosting your own.Recharge: Long.",
  "shortHelp": "PBAoE Foe -Regen, -Recovery; Self +Regen, +Recovery",
  "icon": "psionicassault_psychicsiphon.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 120,
    "endurance": 13,
    "castTime": 1.33,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.75,
      "table": "Melee_Ones"
    },
    "regenDebuff": {
      "scale": 2.5,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 2.5,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.035,
      "table": "Melee_Ones"
    }
  }
};
