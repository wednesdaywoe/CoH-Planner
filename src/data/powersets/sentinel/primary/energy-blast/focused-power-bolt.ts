/**
 * Focused Power Bolt
 * Ranged, DMG(Energy/Smash), Foe Knockback
 *
 * Source: sentinel_ranged/energy_blast/focused_power_bolt.json
 */

import type { Power } from '@/types';

export const FocusedPowerBolt: Power = {
  "name": "Focused Power Bolt",
  "internalName": "Focused_Power_Bolt",
  "available": 21,
  "description": "A focused and very accurate blast that deals tremendous damage.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
  "icon": "powerblast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.67
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
      "scale": 0.584,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.336,
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
