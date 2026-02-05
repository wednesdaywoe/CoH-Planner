/**
 * Thaw
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Cold, Slow)
 *
 * Source: controller_buff/thermal_radiation/thaw.json
 */

import type { Power } from '@/types';

export const Thaw: Power = {
  "name": "Thaw",
  "internalName": "Thaw",
  "available": 19,
  "description": "Warms an ally and frees them from any Disorient, Hold, Sleep, Confuse, Fear, Slow and Immobilize effects and leaves them resistant to such effects for a good while. Thaw also grants the target some resistance to Cold damage. Some of the effects of this power will improve with multiple applications and as you advance in level.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Cold, Slow)",
  "icon": "thermalradiation_thaw.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 90,
    "fear": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "resistance": {
      "cold": {
        "scale": 1,
        "table": "Ranged_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.8,
        "table": "Ranged_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.8,
      "table": "Ranged_Ones"
    }
  }
};
