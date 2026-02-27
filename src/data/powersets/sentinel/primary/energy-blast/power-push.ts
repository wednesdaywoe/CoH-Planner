/**
 * Power Push
 * Ranged DMG(Energy/Smash), Foe High Knockback
 *
 * Source: sentinel_ranged/energy_blast/power_push.json
 */

import type { Power } from '@/types';

export const PowerPush: Power = {
  "name": "Power Push",
  "internalName": "Power_Push",
  "available": 11,
  "description": "This ranged attack deals little damage, but sends the target flying for a great distance.",
  "shortHelp": "Ranged DMG(Energy/Smash), Foe High Knockback",
  "icon": "powerblast_powerpush.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.1
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
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.328,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.312,
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
