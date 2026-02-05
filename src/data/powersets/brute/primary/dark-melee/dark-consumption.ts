/**
 * Dark Consumption
 * PBAoE DMG(Negative), Self +End
 *
 * Source: brute_melee/dark_melee/dark_consumption.json
 */

import type { Power } from '@/types';

export const DarkConsumption: Power = {
  "name": "Dark Consumption",
  "internalName": "Dark_Consumption",
  "available": 17,
  "description": "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
  "shortHelp": "PBAoE DMG(Negative), Self +End",
  "icon": "shadowfighting_darkconsumption.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 180,
    "endurance": 0.52,
    "castTime": 1.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Endurance Modification",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.36,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    }
  }
};
