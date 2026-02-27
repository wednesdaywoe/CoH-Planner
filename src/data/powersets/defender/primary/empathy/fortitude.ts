/**
 * Fortitude
 * Ally +DEF(All), +DMG, +To Hit
 *
 * Source: defender_buff/empathy/fortitude.json
 */

import type { Power } from '@/types';

export const Fortitude: Power = {
  "name": "Fortitude",
  "internalName": "Fortitude",
  "available": 11,
  "description": "Fortitude immensely enhances a single ally's chance to hit, Damage, and Defense to all attacks.Recharge: Slow.",
  "shortHelp": "Ally +DEF(All), +DMG, +To Hit",
  "icon": "empathy_fortitude.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 1.5,
      "table": "Ranged_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 2.5,
      "table": "Ranged_Buff_Dmg"
    },
    "defenseBuff": {
      "ranged": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "smashing": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "lethal": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "fire": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "cold": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "energy": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "negative": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "psionic": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "toxic": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      }
    }
  }
};
