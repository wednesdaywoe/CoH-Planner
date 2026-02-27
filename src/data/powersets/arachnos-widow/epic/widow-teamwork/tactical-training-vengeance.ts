/**
 * Tactical Training: Vengeance
 * Ranged (Targeted AoE), Teammates +DMG, +To Hit, +DEF(All), Res(Effects)
 *
 * Source: teamwork/widow_teamwork/nw_tactical_training:_vengeance.json
 */

import type { Power } from '@/types';

export const TacticalTrainingVengeance: Power = {
  "name": "Tactical Training: Vengeance",
  "available": 27,
  "description": "The loss of a comrade enrages the team. When a teammate is defeated in combat, activate this power to grant you and your teammates a bonus to chance to hit, Damage and Defense to all attacks. A Vengeful team has no fear, and Vengeance protects you and your Teammates from Fear effects. It also gives you and your team great resistance to Sleep, Hold, Disorient, Immobilize, Confuse, Taunt, Placate and Knockback. This power does not stack with multiple castings.",
  "shortHelp": "Ranged (Targeted AoE), Teammates +DMG, +To Hit, +DEF(All), Res(Effects)",
  "icon": "widowteamwork_tacticaltrainingvengeance.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Range",
    "Healing",
    "ToHit",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Healing",
    "To Hit Buff"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 300,
    "castTime": 1.17,
    "radius": 100,
    "maxTargets": 255
  },
  "targetType": "Leaguemate (Dead)",
  "damage": {
    "type": "Heal",
    "scale": 1,
    "table": "Melee_Heal"
  },
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "smashing": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 2.5,
        "table": "Melee_Buff_Def"
      }
    },
    "tohitBuff": {
      "scale": 3.5,
      "table": "Melee_Buff_ToHit"
    },
    "confuse": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "fear": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "knockup": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 3.5,
      "table": "Melee_Buff_Dmg"
    },
    "effectDuration": 120
  }
};
