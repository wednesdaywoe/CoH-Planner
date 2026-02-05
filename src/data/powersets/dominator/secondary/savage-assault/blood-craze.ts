/**
 * Blood Craze
 * Self +HP, +Health over Time
 *
 * Source: dominator_assault/savage_assault/blood_craze.json
 */

import type { Power } from '@/types';

export const BloodCraze: Power = {
  "name": "Blood Craze",
  "internalName": "Blood_Craze",
  "available": 23,
  "description": "You go into a blood craze, making you quickly shrug aside some of the damage received. Blood Craze will immediately heal you for a small amount and cause you to heal for a moderate amount of health over time.Recharge: Long.",
  "shortHelp": "Self +HP, +Health over Time",
  "icon": "savagemelee_bloodthirst.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 180,
    "endurance": 7.8,
    "castTime": 2
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
  "damage": [
    {
      "type": "Heal",
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    {
      "type": "Heal",
      "scale": 0.25,
      "table": "Melee_HealSelf",
      "duration": 9.1,
      "tickRate": 1
    }
  ]
};
