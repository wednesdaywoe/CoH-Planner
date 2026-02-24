/**
 * Power Burst
 * Ranged, Superior DMG(Energy/Smash), Foe Knockback, Special
 *
 * Source: dominator_assault/energy_assault/power_burst.json
 */

import type { Power } from '@/types';

export const PowerBurst: Power = {
  "name": "Power Burst",
  "internalName": "Power_Burst",
  "available": 29,
  "description": "A devastating attack that can knock your target off their feet. This power will inflict bonus damage if used while in Energy Focus mode.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Ranged, Superior DMG(Energy/Smash), Foe Knockback, Special",
  "icon": "energyassault_powerburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 1.67
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
      "scale": 0.78,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.82,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    }
  }
};
