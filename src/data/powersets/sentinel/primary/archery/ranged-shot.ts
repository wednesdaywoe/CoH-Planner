/**
 * Perfect Shot
 * Ranged, High DMG(Lethal)
 *
 * Source: sentinel_ranged/archery/ranged_shot.json
 */

import type { Power } from '@/types';

export const PerfectShot: Power = {
  "name": "Perfect Shot",
  "internalName": "Ranged_Shot",
  "available": 21,
  "description": "A perfectly aimed and fast shot that blasts your foes.Damage: High.Recharge: Slow.",
  "shortHelp": "Ranged, High DMG(Lethal)",
  "icon": "archery_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.386,
    "range": 60,
    "recharge": 12,
    "endurance": 11.86,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 2.28,
    "table": "Ranged_Damage"
  }
};
