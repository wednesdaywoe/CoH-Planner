/**
 * Overgrowth
 * PBAoE, Team +Damage, +To Hit, +Endurance Discount, +5 Bloom
 *
 * Source: corruptor_buff/nature_affinity/overgrowth.json
 */

import type { Power } from '@/types';

export const Overgrowth: Power = {
  "name": "Overgrowth",
  "internalName": "Overgrowth",
  "available": 29,
  "description": "Becoming a conduit of nature itself, you greatly boost the damage, to hit and endurance discount of nearby allies for a long period of time. Overgrowth also grants the affected targets 5 stacks of Bloom.Recharge: Very Long.",
  "shortHelp": "PBAoE, Team +Damage, +To Hit, +Endurance Discount, +5 Bloom",
  "icon": "natureaffinity_overgrowth.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 255,
    "endurance": 26,
    "castTime": 3,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 6.6,
      "table": "Ranged_Buff_Dmg"
    },
    "enduranceDiscount": {
      "scale": 0.5,
      "table": "Ranged_Stun"
    }
  }
};
