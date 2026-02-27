/**
 * Power Blast
 * Ranged, High DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus
 *
 * Source: dominator_assault/energy_assault/power_blast.json
 */

import type { Power } from '@/types';

export const PowerBlast: Power = {
  "name": "Power Blast",
  "internalName": "Power_Blast",
  "available": 9,
  "description": "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock them back. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.Damage: High.Recharge: Moderate.",
  "shortHelp": "Ranged, High DMG(Energy/Smash), Foe Knockback, Chance for Energy Focus",
  "icon": "energyassault_powerblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67
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
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.49,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.47,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    }
  }
};
