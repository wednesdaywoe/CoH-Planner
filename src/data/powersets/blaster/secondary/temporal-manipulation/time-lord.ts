/**
 * Time Lord
 * Auto: Self +Recharge, +Resist(Energy, Disorient, Slow)
 *
 * Source: blaster_support/time_manipulation/time_lord.json
 */

import type { Power } from '@/types';

export const TimeLord: Power = {
  "name": "Time Lord",
  "internalName": "Time_Lord",
  "available": 29,
  "description": "You are a time lord, for you time is just a small hurdle that can easily be overcome or ignored. As a time lord, all your attacks recharge faster and you are resistant to energy attacks in addition to disorient effects, movement debuffs and recharge debuffs. If you are affected by the Accelerated effect, your powers will recharge even faster and you will become nearly immune to recharge debuffs. This power is always on and cost no endurance.",
  "shortHelp": "Auto: Self +Recharge, +Resist(Energy, Disorient, Slow)",
  "icon": "timemanipulation_timelord.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Ones"
      }
    },
    "resistance": {
      "energy": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      }
    },
    "stun": {
      "mag": 1,
      "scale": 10,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.5
  }
};
