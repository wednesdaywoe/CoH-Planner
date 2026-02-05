/**
 * Enforced Morale
 * Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception, +Recharge, +Speed, Light DMG
 *
 * Source: corruptor_buff/pain_domination/enforced_morale.json
 */

import type { Power } from '@/types';

export const EnforcedMorale: Power = {
  "name": "Enforced Morale",
  "internalName": "Enforced_Morale",
  "available": 15,
  "description": "Enforced Morale frees an ally from any Disorient, Hold, Sleep, Fear, Confuse and Immobilize effects and leaves them resistant to such effects for a good while. Also, Enforced Morale grants the target clearer Perception to see hidden foes, and a minor recharge and movement speed boost. The Protection and Movement boosts will improve with multiple applications and as you advance in level, although the Recharge and Movement boosts will only apply for the first few applications. If the ally is not damaged, Enforced Morale will cause them some pain before granting its benefits.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ally +Res(Disorient, Hold, Sleep, Immobilize, Fear, Confuse), +Perception, +Recharge, +Speed, Light DMG",
  "icon": "paindomination_enforcedmorale.png",
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
  "damage": {
    "type": "Special",
    "scale": 1,
    "table": "Ranged_Ones"
  },
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
    "rechargeBuff": {
      "scale": 0.05,
      "table": "Ranged_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.05,
        "table": "Ranged_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.05,
        "table": "Ranged_SpeedFlying"
      },
      "jumpSpeed": {
        "scale": 0.05,
        "table": "Ranged_SpeedJumping"
      },
      "jumpHeight": {
        "scale": 0.05,
        "table": "Ranged_Leap"
      }
    },
    "perceptionBuff": {
      "scale": 2.5,
      "table": "Ranged_Res_Boolean"
    }
  }
};
