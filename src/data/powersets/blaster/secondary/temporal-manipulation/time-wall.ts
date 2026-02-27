/**
 * Time Wall
 * Ranged, DMG(Energy), Foe Immobilize, -SPD, -Recharge, -Regen, Special
 *
 * Source: blaster_support/time_manipulation/time_wall.json
 */

import type { Power } from '@/types';

export const TimeWall: Power = {
  "name": "Time Wall",
  "internalName": "Time_Wall",
  "available": 0,
  "description": "You create a time barrier to immobilize a single enemy. Enemies behind this barrier will have time slow down around them reducing their attack rate. Enemies that are strong enough to cross the barrier will still have their movement speed reduced. Time is slowed to such an extreme that their wounds will take longer to heal, reducing their regeneration rate. Time Wall applies the Delayed effect on its target. Damage, debuff and control effects from other Temporal Manipulation powers are increased on targets affected by Delayed.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, DMG(Energy), Foe Immobilize, -SPD, -Recharge, -Regen, Special",
  "icon": "timemanipulation_timewall.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.6
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.6,
      "table": "Ranged_Slow"
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "regenDebuff": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 0.106,
      "table": "Ranged_Ones"
    }
  }
};
