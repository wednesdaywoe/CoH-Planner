/**
 * Speed Boost
 * Ranged, Allies +SPD, +Recharge, +Recovery, Res Slow
 *
 * Source: corruptor_buff/kinetics/speed_boost.json
 */

import type { Power } from '@/types';

export const SpeedBoost: Power = {
  "name": "Speed Boost",
  "internalName": "Speed_Boost",
  "available": 19,
  "description": "You can hasten a targeted ally and its nearby allies. The allies' movement speed, attack rate, and Endurance recovery are all greatly increased and they gain resistance to Slow effects. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Allies +SPD, +Recharge, +Recovery, Res Slow",
  "icon": "kineticboost_speedboost.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 2,
    "endurance": 7.8,
    "castTime": 1,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Run Speed",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Running",
    "Running & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Melee_SpeedFlying"
      }
    }
  }
};
