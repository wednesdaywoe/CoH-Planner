/**
 * Dark Consumption
 * PBAoE Minor DMG(Negative), Self +End
 *
 * Source: blaster_support/darkness_manipulation/dark_consumption.json
 */

import type { Power } from '@/types';

export const DarkConsumption: Power = {
  "name": "Dark Consumption",
  "internalName": "Dark_Consumption",
  "available": 23,
  "description": "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
  "shortHelp": "PBAoE Minor DMG(Negative), Self +End",
  "icon": "darknessmanipulation_darkconsumption.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 180,
    "endurance": 0.52,
    "castTime": 1.03,
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
    "type": "Negative",
    "scale": 0.8,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.031,
      "table": "Melee_Ones"
    }
  }
};
