/**
 * Dark Consumption
 * PBAoE DMG(Negative), Self +End
 *
 * Source: tanker_melee/dark_melee/dark_consumption.json
 */

import type { Power } from '@/types';

export const DarkConsumption: Power = {
  "name": "Dark Consumption",
  "internalName": "Dark_Consumption",
  "available": 27,
  "description": "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE DMG(Negative), Self +End",
  "icon": "shadowfighting_darkconsumption.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
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
    "Endurance Modification",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.6154,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.2769,
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
