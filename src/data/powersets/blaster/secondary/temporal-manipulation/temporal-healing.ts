/**
 * Temporal Healing
 * Toggle: Self +Absorb, +Recovery, +Resist(Slow, Regen Debuff)
 *
 * Source: blaster_support/time_manipulation/temporal_healing.json
 */

import type { Power } from '@/types';

export const TemporalHealing: Power = {
  "name": "Temporal Healing",
  "internalName": "Temporal_Healing",
  "available": 19,
  "description": "You mend your wounds by placing your bodies in a past or future state where they are far less injured. Temporal Mending will immediately absorb damage as it's inflicted. Additionally, you will gain some resistance to slow effects and regeneration debuffs. If you are affected by the Accelerated effect, you absorb even more damage from this power.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Absorb, +Recovery, +Resist(Slow, Regen Debuff)",
  "icon": "timemanipulation_temporalhealing.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "castTime": 2.03
  },
  "allowedEnhancements": [
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
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.5,
      "table": "Melee_Res_Boolean"
    },
    "absorb": {
      "scale": 0.15,
      "table": "Melee_HealSelf"
    }
  }
};
