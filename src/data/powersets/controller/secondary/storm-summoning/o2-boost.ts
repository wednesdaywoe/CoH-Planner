/**
 * O2 Boost
 * Ally Heal, +Res(Disorient, Sleep, End Drain), +Perception
 *
 * Source: controller_buff/storm_summoning/o2_boost.json
 */

import type { Power } from '@/types';

export const O2Boost: Power = {
  "name": "O2 Boost",
  "internalName": "O2_Boost",
  "available": 0,
  "description": "Saturates the air around a targeted ally with rich oxygen, healing their wounds. The O2 Boost can protect a targeted ally from Sleep, Stun and Endurance Drain effects as well as increase perception. You cannot use this power on yourself.Recharge: Fast.",
  "shortHelp": "Ally Heal, +Res(Disorient, Sleep, End Drain), +Perception",
  "icon": "stormsummoning_o2boost.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 13,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 1.32,
    "table": "Ranged_Heal"
  },
  "effects": {
    "enduranceGain": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Ranged_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 4,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 60,
    "perceptionBuff": {
      "scale": 2.5,
      "table": "Ranged_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 20,
      "table": "Ranged_Res_Boolean"
    }
  }
};
