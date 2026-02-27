/**
 * Stone Spears
 * Ranged, Light DMG(Lethal), Foe Knock Up
 *
 * Source: dominator_assault/earth_assault/stone_spears.json
 */

import type { Power } from '@/types';

export const StoneSpears: Power = {
  "name": "Stone Spears",
  "internalName": "Stone_Spears",
  "available": 0,
  "description": "Stone Spears erupt from the ground at the feet of your target. This attack can only be used against targets on the ground, and does moderate lethal damage.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Lethal), Foe Knock Up",
  "icon": "earthassault_stonespears.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockup": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
