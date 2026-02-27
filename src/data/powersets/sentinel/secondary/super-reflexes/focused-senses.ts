/**
 * Focused Senses
 * Toggle: Self +DEF(Ranged), +Perception, Res(DeBuff DEF)
 *
 * Source: sentinel_defense/super_reflexes/focused_senses.json
 */

import type { Power } from '@/types';

export const FocusedSenses: Power = {
  "name": "Focused Senses",
  "internalName": "Focused_Senses",
  "available": 0,
  "description": "You become more evasive against ranged attacks while you have Focused Senses activated. This will increase your Defense versus ranged attacks as long as it is active. Your Improved Senses also allow you to perceive stealthy foes as well as resist Defense DeBuffs. If you own Master Brawler you will also gain resistance to Disorient, Hold, Sleep powers. Focused Senses also adds an Elusivity defense bonus to Ranged Attacks in PVP zones.Recharge: Fast.",
  "shortHelp": "Toggle: Self +DEF(Ranged), +Perception, Res(DeBuff DEF)",
  "icon": "superreflexes_focusedsenses.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 2.03
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
      "ranged": {
        "scale": 1.85,
        "table": "Melee_Buff_Def"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.4,
        "table": "Melee_Res_Boolean"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
