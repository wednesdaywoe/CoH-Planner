/**
 * Clarity
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Terrorize, Confusion), +Perception
 *
 * Source: defender_buff/sonic_debuff/clarity.json
 */

import type { Power } from '@/types';

export const Clarity: Power = {
  "name": "Clarity",
  "internalName": "Clarity",
  "available": 21,
  "description": "By bouncing a carefully pitched sound wave off an ally's ear drum, you can free them from any Disorient, Hold, Sleep, Confusion, Fear, or Immobilize effects, and leave them resistant to such effects for a good while. Protection will improve with multiple applications and as you advance in level. Clarity also provides your ally enhanced perception.Recharge: Fast.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Terrorize, Confusion), +Perception",
  "icon": "sonicdebuff_dispel.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
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
    "perceptionBuff": {
      "scale": 2.5,
      "table": "Ranged_Res_Boolean"
    }
  }
};
