/**
 * Antidote
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Slow, Cold, Toxic)
 *
 * Source: controller_buff/poison/antidote.json
 */

import type { Power } from '@/types';

export const Antidote: Power = {
  "name": "Antidote",
  "internalName": "Antidote",
  "available": 19,
  "description": "This Antidote can free an ally from any Disorient, Hold, Sleep, Slow, Confuse, Fear and Immobilize effects and leaves them resistant to such effects for a good while. The Antidote also grants the target some resistance to Cold and Toxic damage. Some of the effects of this power will improve with Multiple applications and as you advance in level.Recharge: Fast.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Confuse, Fear, Slow, Cold, Toxic)",
  "icon": "poison_antidote.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.53
  },
  "allowedEnhancements": [
    "Resistance",
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
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
