/**
 * Field Operative
 * Toggle: Self Stealth, +DEF(All), +Special, +Regeneration, +Recovery
 *
 * Source: blaster_support/gadgets/cloaking_device.json
 */

import type { Power } from '@/types';

export const FieldOperative: Power = {
  "name": "Field Operative",
  "internalName": "Cloaking_Device",
  "available": 19,
  "description": "Through a mixture of combat training and highly sophisticated devices you are considered a Field Operative. You use an LCD body coating to become partially invisible. While concealed you can only be seen at very close range. If you attack while concealed, you will be discovered. Even if discovered, you are hard to see but will retain some of your Defense bonus to all attacks. Unlike some stealth powers, Field Operative has no movement penalty. This power's stealth component will not work with any other form of Concealment power such as Shadow Fall or Steamy Mist. In addition to being stealthy, your training also allows you to regenerate health and recovery endurance at an accelerated rate while this power is active. However, only half of this regeneration bonus is enhanceable.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self Stealth, +DEF(All), +Special, +Regeneration, +Recovery",
  "icon": "gadgets_cloak.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "stealth": {
      "stealthPvE": {
        "scale": 35.5,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 390,
        "table": "Melee_Ones"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    },
    "regenBuff": {
      "scale": 1.125,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    }
  }
};
