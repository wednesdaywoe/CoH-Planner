/**
 * Serum
 * Self Heal, +Max HP
 *
 * Source: training_gadgets/crab_spider_training/serum.json
 */

import type { Power } from '@/types';

export const Serum: Power = {
  "name": "Serum",
  "available": 23,
  "description": "You can activate this power to increase your maximum Hit Points for a short time.",
  "shortHelp": "Self Heal, +Max HP",
  "icon": "crabspidertraining_serum.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 10.4,
    "castTime": 1.3
  },
  "targetType": "Self",
  "damage": {
    "type": "Heal",
    "scale": 4,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "maxHPBuff": {
      "scale": 2,
      "table": "Melee_HealSelf"
    }
  }
};
