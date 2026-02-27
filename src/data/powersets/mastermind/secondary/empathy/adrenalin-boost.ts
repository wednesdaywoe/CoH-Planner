/**
 * Adrenalin Boost
 * Ranged, Ally +End, +Regeneration, +Recharge, Res (Slow)
 *
 * Source: mastermind_buff/empathy/adrenalin_boost.json
 */

import type { Power } from '@/types';

export const AdrenalinBoost: Power = {
  "name": "Adrenalin Boost",
  "internalName": "Adrenalin_Boost",
  "available": 29,
  "description": "Dramatically increases an ally's Endurance Recovery, Hit Point Regeneration and attack rate for 90 seconds. Also grants the target high resistance to slow effects.Recharge: Very Long.",
  "shortHelp": "Ranged, Ally +End, +Regeneration, +Recharge, Res (Slow)",
  "icon": "empathy_adrenalinboost.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 300,
    "endurance": 13,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "recoveryBuff": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "regenBuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    },
    "rechargeBuff": {
      "scale": 0.8,
      "table": "Ranged_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.8,
        "table": "Ranged_Ones"
      },
      "flySpeed": {
        "scale": 0.8,
        "table": "Ranged_Ones"
      },
      "jumpSpeed": {
        "scale": 0.8,
        "table": "Ranged_Ones"
      },
      "jumpHeight": {
        "scale": 0.8,
        "table": "Ranged_Ones"
      }
    }
  }
};
