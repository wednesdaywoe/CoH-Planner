/**
 * Consume
 * PBAoE, DMG(Fire), Self +End
 *
 * Source: blaster_support/fire_manipulation/consume.json
 */

import type { Power } from '@/types';

export const Consume: Power = {
  "name": "Consume",
  "internalName": "Consume",
  "available": 23,
  "description": "You can Consume some fuel from your nearby enemies to recover Endurance.Damage: Minor.Recharge: Long.",
  "shortHelp": "PBAoE, DMG(Fire), Self +End",
  "icon": "firemanipulation_consume.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 180,
    "endurance": 0.52,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.4,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceGain": {
      "scale": 20,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.05,
      "table": "Melee_Ones"
    }
  }
};
