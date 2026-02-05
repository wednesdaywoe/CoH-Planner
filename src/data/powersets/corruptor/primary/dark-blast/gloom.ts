/**
 * Gloom
 * Ranged, DoT(Negative), Foe -To Hit
 *
 * Source: corruptor_ranged/dark_blast/gloom.json
 */

import type { Power } from '@/types';

export const Gloom: Power = {
  "name": "Gloom",
  "internalName": "Gloom",
  "available": 0,
  "description": "Gloom slowly drains a target of life, while reducing their chance to hit. Slower than Dark Blast, but deals more damage over time.",
  "shortHelp": "Ranged, DoT(Negative), Foe -To Hit",
  "icon": "darkcast_souldrain.png",
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
    "Corruptor Archetype Sets",
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
