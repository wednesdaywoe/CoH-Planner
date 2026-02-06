/**
 * Temperature Protection
 * Auto: Self +Res(Fire, Cold, Slow, Knock), +Regen
 *
 * Source: stalker_defense/fiery_aura/temperature_protection.json
 */

import type { Power } from '@/types';

export const TemperatureProtection: Power = {
  "name": "Temperature Protection",
  "internalName": "Temperature_Protection",
  "available": 9,
  "description": "Temperature Protection gives you strong resistance to Fire damage, some resistance to Cold damage and slow effects, and grants minor, unenhanceable regeneration as well as provide very minor Knockback Protection. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res(Fire, Cold, Slow, Knock), +Regen",
  "icon": "flamingshield_temperatureprotection.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "cold": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
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
      "scale": 1,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "knockup": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
