/**
 * Frostwork
 * Target +Max HP, Res(Toxic)
 *
 * Source: mastermind_buff/cold_domination/frostwork.json
 */

import type { Power } from '@/types';

export const Frostwork: Power = {
  "name": "Frostwork",
  "internalName": "Frostwork",
  "available": 15,
  "description": "Covers an ally in a thick layer of Frost. The frost can absorb the impact from enemy attacks, effectively increasing your ally's maximum Hit Points for a short time. Frostwork also grants your ally resistance to Toxic Damage.Recharge: Slow.",
  "shortHelp": "Target +Max HP, Res(Toxic)",
  "icon": "colddomination_frostwork.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 18.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 4,
      "table": "Ranged_Heal"
    },
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    }
  }
};
