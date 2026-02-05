/**
 * Time Shift
 * Ranged (Targeted AoE), Foe Disorient, -SPD, -ToHit
 *
 * Source: blaster_support/time_manipulation/time_shift.json
 */

import type { Power } from '@/types';

export const TimeShift: Power = {
  "name": "Time Shift",
  "internalName": "Time_Shift",
  "available": 27,
  "description": "You shift time on an area, replacing your foes with future or past versions of themselves. This shift can be very disorienting and will incapacitate affected foes. Stronger foes may be able to resist the effect, but they still will have their movement speed and accuracy reduced. Targets affected by the Delayed effect will suffer from a more powerful disorientation, however its benefits are brief.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Foe Disorient, -SPD, -ToHit",
  "icon": "timemanipulation_timeshift.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 20,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Slow Movement",
    "Stuns",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.4,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.4,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.4,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    },
    "damageBuff": {
      "scale": 0.033,
      "table": "Ranged_Ones"
    }
  }
};
