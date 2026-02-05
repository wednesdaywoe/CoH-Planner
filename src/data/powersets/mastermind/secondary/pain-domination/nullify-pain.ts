/**
 * Nullify Pain
 * PBAoE, Team +Heal
 *
 * Source: mastermind_buff/pain_domination/nullify_pain.json
 */

import type { Power } from '@/types';

export const NullifyPain: Power = {
  "name": "Nullify Pain",
  "internalName": "Nullify_Pain",
  "available": 0,
  "description": "Nullify Pain will heal nearby allies for some hit points by numbing the pain caused by their wounds. Nullify Pain is not as potent as Soothe, but can heal multiple targets at once.Recharge: Moderate.",
  "shortHelp": "PBAoE, Team +Heal",
  "icon": "paindomination_nullifypain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 8,
    "endurance": 16.25,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 0.88,
    "table": "Ranged_Heal"
  }
};
