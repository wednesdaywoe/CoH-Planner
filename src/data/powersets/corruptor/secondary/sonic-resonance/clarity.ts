/**
 * Clarity
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confusion), +Perception
 *
 * Source: corruptor_buff/sonic_resonance/clarity.json
 */

import type { Power } from '@/types';

export const Clarity: Power = {
  "name": "Clarity",
  "internalName": "Clarity",
  "available": 27,
  "description": "By bouncing a carefully pitched sound wave off an ally's ear drum, you can free him from any Disorient, Hold, Sleep, Confusion, Fear, and Immobilize effects, and leave them resistant to such effects for a good while. Protection will improve with multiple applications and as you advance in level. Clarity also provides your ally's enhanced perception.Recharge: Fast.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confusion), +Perception",
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
