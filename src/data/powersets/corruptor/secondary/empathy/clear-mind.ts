/**
 * Clear Mind
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception
 *
 * Source: corruptor_buff/empathy/clear_mind.json
 */

import type { Power } from '@/types';

export const ClearMind: Power = {
  "name": "Clear Mind",
  "internalName": "Clear_Mind",
  "available": 15,
  "description": "Frees an ally from any Disorient, Hold, Sleep, Fear, Confuse and Immobilize effects and leaves them resistant to such effects for a good while. Also, grants target clearer Perception to see hidden foes. Protection will improve with Multiple applications and as you advance in level.Recharge: Fast.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception",
  "icon": "empathy_mindwall.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
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
