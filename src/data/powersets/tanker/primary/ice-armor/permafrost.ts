/**
 * Permafrost
 * Auto: Self +Res(All damage, Slow)
 *
 * Source: tanker_defense/ice_armor/permafrost.json
 */

import type { Power } from '@/types';

export const Permafrost: Power = {
  "name": "Permafrost",
  "internalName": "Permafrost",
  "available": 7,
  "description": "Your body temperature permanently lowers to 33 degrees Fahrenheit. Permafrost gives you strong resistance to Cold damage, some resistance to Fire damage and minor Smashing, Lethal, Energy, Negative Energy, Toxic and Psionic resistance as well. You also gain an inherent resistance to Slow effects. This power is always on and does not cost Endurance.",
  "shortHelp": "Auto: Self +Res(All damage, Slow)",
  "icon": "icearmor_permafrost.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "cold": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "fire": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.5,
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
    }
  }
};
