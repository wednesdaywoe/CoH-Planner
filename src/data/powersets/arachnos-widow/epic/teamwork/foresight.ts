/**
 * Foresight
 * Auto: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Psionics, Special), +Def (all)
 *
 * Source: teamwork/teamwork/foresight.json
 */

import type { Power } from '@/types';

export const Foresight: Power = {
  "name": "Foresight",
  "available": 21,
  "description": "Widows who possess Foresight are resistant to Psionic Damage, as well as Sleep, Hold, Immobilization, Disorient, Confuse and Fear effects. Their precognition becomes clearer in times of duress, providing resistance to all damage types based on their current health, as well. They also have improved Defense, due to being able to see attacks slightly before they actually occur.",
  "shortHelp": "Auto: Self Res (Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Psionics, Special), +Def (all)",
  "icon": "teamwork_foresight.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "psionic": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "smashing": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "lethal": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "fire": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "cold": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "energy": {
        "scale": 0,
        "table": "Melee_Ones"
      },
      "negative": {
        "scale": 0,
        "table": "Melee_Ones"
      }
    },
    "confuse": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.75,
        "table": "Melee_Buff_Def"
      }
    },
    "effectDuration": 0.75
  }
};
