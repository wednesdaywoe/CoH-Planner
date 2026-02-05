/**
 * Gloom
 * Ranged, High DoT(Negative), Foe -To Hit
 *
 * Source: dominator_assault/dark_assault/gloom.json
 */

import type { Power } from '@/types';

export const Gloom: Power = {
  "name": "Gloom",
  "internalName": "Gloom",
  "available": 3,
  "description": "Gloom slowly drains a target of life, while reducing their chance to hit. Slower than Dark Blast, but deals more damage over time.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged, High DoT(Negative), Foe -To Hit",
  "icon": "darknessassault_gloom.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.22,
    "table": "Ranged_Damage",
    "duration": 3.6,
    "tickRate": 0.5
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
