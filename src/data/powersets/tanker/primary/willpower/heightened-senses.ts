/**
 * Heightened Senses
 * Toggle: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative Energy), +Per
 *
 * Source: tanker_defense/willpower/heightened_senses.json
 */

import type { Power } from '@/types';

export const HeightenedSenses: Power = {
  "name": "Heightened Senses",
  "internalName": "Heightened_Senses",
  "available": 17,
  "description": "You become more aware of your environment and its hazards while this power is activated. This will increase your Defense versus environmental damage as long as it is active. Your Heightened Senses also allow you to perceive stealthy foes and resist Defense DeBuffs.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative Energy), +Per",
  "icon": "willpower_heightenedsenses.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 0.33,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.33,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 1.3,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 1.3,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 1.3,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 1.3,
        "table": "Melee_Buff_Def"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
