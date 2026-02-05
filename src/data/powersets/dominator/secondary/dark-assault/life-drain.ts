/**
 * Life Drain
 * Ranged, Moderate DMG(Negative), Target -To Hit, Self +HP
 *
 * Source: dominator_assault/dark_assault/life_drain.json
 */

import type { Power } from '@/types';

export const LifeDrain: Power = {
  "name": "Life Drain",
  "internalName": "Life_Drain",
  "available": 23,
  "description": "You can tap the power of the Netherworld to steal some life from a target foe and reduce their chance to hit. Some of that stolen life is transferred to you in the form of Hit Points.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Negative), Target -To Hit, Self +HP",
  "icon": "darknessassault_lifedrain.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.93
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Accurate To-Hit Debuff",
    "Healing",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Heal",
      "scale": 1,
      "table": "Ranged_HealSelf"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
