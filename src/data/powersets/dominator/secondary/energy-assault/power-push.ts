/**
 * Power Push
 * Ranged Moderate DMG(Energy/Smash), Foe High Knockback, Chance for Energy Focus
 *
 * Source: dominator_assault/energy_assault/power_push.json
 */

import type { Power } from '@/types';

export const PowerPush: Power = {
  "name": "Power Push",
  "internalName": "Power_Push",
  "available": 3,
  "description": "Power Push deals a high amount of Energy and Smashing damage and sends the target flying for a great distance. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged Moderate DMG(Energy/Smash), Foe High Knockback, Chance for Energy Focus",
  "icon": "energyassault_powerpush.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.4,
    "range": 70,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.656,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.984,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 8,
      "table": "Ranged_Knockback"
    }
  }
};
