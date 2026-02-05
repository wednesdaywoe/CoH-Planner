/**
 * Ice Bolt
 * Ranged, DMG(Cold), Foe -Recharge, -SPD
 *
 * Source: sentinel_ranged/ice_blast/ice_bolt.json
 */

import type { Power } from '@/types';

export const IceBolt: Power = {
  "name": "Ice Bolt",
  "internalName": "Ice_Bolt",
  "available": 0,
  "description": "Ice Bolt quickly pelts an enemy with small icy daggers; their chill Slows a foe's attacks and movement for a time. Fast, but little damage.",
  "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
  "icon": "iceblast_bolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.84,
    "table": "Ranged_Damage"
  },
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
