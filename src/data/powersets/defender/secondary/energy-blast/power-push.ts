/**
 * Power Push
 * Ranged DMG(Energy/Smash), Foe High Knockback
 *
 * Source: defender_ranged/energy_blast/power_push.json
 */

import type { Power } from '@/types';

export const PowerPush: Power = {
  "name": "Power Push",
  "internalName": "Power_Push",
  "available": 23,
  "description": "This ranged attack deals little damage, but sends the target flying for a great distance.",
  "shortHelp": "Ranged DMG(Energy/Smash), Foe High Knockback",
  "icon": "powerblast_powerpush.png",
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
    "Defender Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.2,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.2,
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
