/**
 * Gloom
 * Ranged, DoT (Negative), Foe -To Hit
 *
 * Source: mastermind_summon/necromancy/gloom.json
 */

import type { Power } from '@/types';

export const Gloom: Power = {
  "name": "Gloom",
  "internalName": "Gloom",
  "available": 1,
  "description": "Gloom slowly drains a target of life, while reducing their chance to hit Slower than Dark Blast, but deals more damage over time.Spectral Forces:Activating this power has a chance to summon a Specter to your side! Specters fade away over 30 seconds. They cannot be healed, regenerate, upgraded, or commanded, but provide a good distraction. Enhancements in this power will also enhance the stats of summoned Specters. You may only have 1 Specter active per Necromancy attack.",
  "shortHelp": "Ranged, DoT (Negative), Foe -To Hit",
  "icon": "necromancy_gloom.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 10.66,
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
