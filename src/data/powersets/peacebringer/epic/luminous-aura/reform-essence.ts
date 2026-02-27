/**
 * Reform Essence
 * Self Heal
 *
 * Source: peacebringer_defensive/luminous_aura/reform_essence.json
 */

import type { Power } from '@/types';

export const ReformEssence: Power = {
  "name": "Reform Essence",
  "available": 21,
  "description": "Through perfect control of your body and energy, you can concentrate for a few moments and heal yourself.  Recharge: Slow.",
  "shortHelp": "Self Heal",
  "icon": "luminousaura_reformessence.png",
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
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "targetType": "Self",
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  }
};
