/**
 * Power Bolt
 * Ranged, Light DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus
 *
 * Source: dominator_assault/energy_assault/power_bolt.json
 */

import type { Power } from '@/types';

export const PowerBolt: Power = {
  "name": "Power Bolt",
  "internalName": "Power_Bolt",
  "available": 0,
  "description": "A quick attack that rapidly hurls small bolts of energy at foes, sometimes knocking them down. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus",
  "icon": "energyassault_powerbolt.png",
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
      "scale": 0.4,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.6,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.7,
      "table": "Ranged_Knockback"
    }
  }
};
