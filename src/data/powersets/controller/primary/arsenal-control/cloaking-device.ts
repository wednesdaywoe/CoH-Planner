/**
 * Cloaking Device
 * Toggle: Self Stealth, +DEF(All)
 *
 * Source: controller_control/arsenal_control/cloaking_device.json
 */

import type { Power } from '@/types';

export const CloakingDevice: Power = {
  "name": "Cloaking Device",
  "internalName": "Cloaking_Device",
  "available": 7,
  "description": "This Cloaking Device is the ultimate in infiltration technology. It uses an LCD body coating to become all but impossible to detect. While concealed you can only be seen at very close range. If you attack while concealed, you will be discovered. Even if discovered, you are hard to see but will retain some of your Defense bonus to all attacks.",
  "shortHelp": "Toggle: Self Stealth, +DEF(All)",
  "icon": "arsenalcontrol_cloakingdevice.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.182,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
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
    "threatDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "stealth": {
      "stealthPvP": {
        "scale": 1000,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 200,
        "table": "Melee_Ones"
      }
    }
  }
};
