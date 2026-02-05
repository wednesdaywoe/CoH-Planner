/**
 * Twilight Grasp
 * Ranged, Foe -To Hit, -DMG, -Regen, Team Heal
 *
 * Source: controller_buff/darkness_affinity/twilight_grasp.json
 */

import type { Power } from '@/types';

export const TwilightGrasp: Power = {
  "name": "Twilight Grasp",
  "internalName": "Twilight_Grasp",
  "available": 0,
  "description": "You channel Negative Energy from the Netherworld through yourself to a targeted foe. Twilight Grasp drains the power from that target and slowly transfers it to you and all nearby allies. The targeted foe's chance to hit, damage and regeneration rate are reduced, while you and your nearby allies are healed.",
  "shortHelp": "Ranged, Foe -To Hit, -DMG, -Regen, Team Heal",
  "icon": "darkmiasma_twilightgrasp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 7.8,
    "castTime": 2.37
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Accurate To-Hit Debuff",
    "Healing",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "damageDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Dam"
    },
    "regenDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
