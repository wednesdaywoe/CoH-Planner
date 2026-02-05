/**
 * Wild Bastion
 * PBAoE, Team +Absorb, +Heal Over Time, +3 Bloom
 *
 * Source: controller_buff/nature_affinity/wild_bastion.json
 */

import type { Power } from '@/types';

export const WildBastion: Power = {
  "name": "Wild Bastion",
  "internalName": "Wild_Bastion",
  "available": 19,
  "description": "You encase yourself and nearby allies in a protective barrier that will absorb a moderate amount of damage. Additionally, affected allies will heal for a portion of their health over time. Wild Bastion places 3 stacks of Bloom on all affected targets.Recharge: Long.",
  "shortHelp": "PBAoE, Team +Absorb, +Heal Over Time, +3 Bloom",
  "icon": "natureaffinity_wildbastion.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 240,
    "endurance": 13,
    "castTime": 2.27,
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
    "scale": 0.2727,
    "table": "Ranged_Heal",
    "duration": 10.1,
    "tickRate": 1
  },
  "effects": {
    "absorb": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
