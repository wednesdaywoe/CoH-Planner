/**
 * Precognition
 * Auto: Self +DEF(Melee, Ranged, AoE, Psionic), Res(DeBuff DEF), +Perception
 *
 * Source: stalker_defense/psionic_armor/precognition.json
 */

import type { Power } from '@/types';

export const Precognition: Power = {
  "name": "Precognition",
  "internalName": "Precognition",
  "available": 23,
  "description": "Precognition allows you to read your enemies' minds, letting you see their attacks before they happen and increasing your perception. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +DEF(Melee, Ranged, AoE, Psionic), Res(DeBuff DEF), +Perception",
  "icon": "psionicarmor_precognition.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
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
      "psionic": {
        "scale": 1,
        "table": "Melee_Buff_Def"
      }
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.2312,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
