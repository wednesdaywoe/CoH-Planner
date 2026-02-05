/**
 * Soothe
 * Ally Heal
 *
 * Source: defender_buff/pain_domination/soothe.json
 */

import type { Power } from '@/types';

export const Soothe: Power = {
  "name": "Soothe",
  "internalName": "Soothe",
  "available": 0,
  "description": "You heal an ally by numbing their pain and calming their mind. You cannot use this power on yourself.Recharge: Fast.",
  "shortHelp": "Ally Heal",
  "icon": "paindomination_soothe.png",
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
