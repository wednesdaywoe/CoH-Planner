/**
 * Serum
 * Buff Mercenaries +DMG, +RES(All except Psionic), +To Hit, +Recovery
 *
 * Source: mastermind_summon/mercenaries/serum.json
 */

import type { Power } from '@/types';

export const Serum: Power = {
  "name": "Serum",
  "internalName": "Serum",
  "available": 17,
  "description": "You can use a special Serum to turn your Mercenaries into a virtually Unstoppable killing machines for a short time. The Serum, will increase their Damage, chance to hit, Endurance Recovery, and Damage Resistance to all damage except Psionics. They will also be virtually immune to controlling effects including Disorient, Sleep, Hold, Immobilize and Knockback. The effects will start to slowly fade away over 60 seconds.Recharge: Very Long.",
  "shortHelp": "Buff Mercenaries +DMG, +RES(All except Psionic), +To Hit, +Recovery",
  "icon": "paramilitary_serum.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 250,
    "endurance": 15,
    "castTime": 1.3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage",
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 4,
        "table": "Ranged_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 60,
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
    "knockup": {
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "knockback": {
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "repel": {
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "damageBuff": {
      "scale": 10,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "recoveryBuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
