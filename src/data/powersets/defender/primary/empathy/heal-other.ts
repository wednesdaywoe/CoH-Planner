/**
 * Heal Other
 * Ally Heal
 *
 * Source: defender_buff/empathy/heal_other.json
 */

import type { Power } from '@/types';

export const HealOther: Power = {
  "name": "Heal Other",
  "internalName": "Heal_Other",
  "available": 0,
  "description": "Heals a single targeted ally. You cannot use this power to heal yourself.Recharge: Fast.",
  "shortHelp": "Ally Heal",
  "icon": "empathy_healother.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 13,
    "castTime": 2.27
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
  "damage": {
    "type": "Heal",
    "scale": 1.96,
    "table": "Ranged_Heal"
  }
};
