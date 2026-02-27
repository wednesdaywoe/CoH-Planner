/**
 * Essence Boost
 * Self Heal, +Max HP, Res (Toxic)
 *
 * Source: peacebringer_defensive/luminous_aura/essence_boost.json
 */

import type { Power } from '@/types';

export const EssenceBoost: Power = {
  "name": "Essence Boost",
  "available": 3,
  "description": "You can activate this power to increase your maximum Hit Points for a short time. Essence Boost also grants you resistance to Toxic Damage.  Recharge: Very Long.",
  "shortHelp": "Self Heal, +Max HP, Res (Toxic)",
  "icon": "luminousaura_essenceboost.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 360,
    "endurance": 10.4,
    "castTime": 0.73
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
    },
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
