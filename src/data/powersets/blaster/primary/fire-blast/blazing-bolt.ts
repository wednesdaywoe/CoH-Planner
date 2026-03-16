/**
 * Blazing Bolt
 * Sniper, DMG(Fire), Self +Range
 *
 * Source: blaster_ranged/fire_blast/blazing_bolt.json
 */

import type { Power } from '@/types';

export const BlazingBolt: Power = {
  "name": "Blazing Bolt",
  "internalName": "Blazing_Bolt",
  "available": 21,
  "description": "A long range beam of fire that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Fire), Self +Range",
  "icon": "fireblast_blazingbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 3.67
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 4.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.225,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "quickSnipe": {
    "stats": {
      "castTime": 1.67,
      "range": 80
    },
    "damage": [
      {
        "type": "Fire",
        "scale": 2.28,
        "table": "Ranged_Damage"
      },
      {
        "type": "Fire",
        "scale": 0.225,
        "table": "Ranged_Damage",
        "duration": 3.1,
        "tickRate": 1.0
      }
    ]
  },
  "effects": {
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    },
    "rangeBuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "durations": {
      "rangeBuff": 10
    },
    "buffDuration": 10
  }
};
