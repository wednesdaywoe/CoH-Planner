/**
 * World of Pain
 * PBAoE Team +To Hit, +DMG, +RES(All DMG, Placate)
 *
 * Source: corruptor_buff/pain_domination/world_of_pain.json
 */

import type { Power } from '@/types';

export const WorldofPain: Power = {
  "name": "World of Pain",
  "internalName": "World_of_Pain",
  "available": 23,
  "description": "When this power is activated the user and all nearby team members will gain a moderate damage, resistance, and To Hit bonus. Additionally those affected by this power will also be protected from Placate effects.Recharge: Long.",
  "shortHelp": "PBAoE Team +To Hit, +DMG, +RES(All DMG, Placate)",
  "icon": "paindomination_worldofpain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 35,
    "recharge": 240,
    "endurance": 10.192,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage",
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "placate": {
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "resistance": {
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Res_Dmg"
      }
    },
    "damageBuff": {
      "scale": 1.6,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
