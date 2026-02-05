/**
 * Power Bolt
 * Ranged, DMG(Energy/Smash), Foe Knockback
 *
 * Source: sentinel_ranged/energy_blast/power_bolt.json
 */

import type { Power } from '@/types';

export const PowerBolt: Power = {
  "name": "Power Bolt",
  "internalName": "Power_Bolt",
  "available": 0,
  "description": "A quick attack that rapidly hurls small bolts of energy at foes, sometimes knocking them down. Fast, but little damage.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
  "icon": "powerblast_powerbolts.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
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
    "Sentinel Archetype Sets",
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
      "scale": 0.8,
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
