/**
 * Ranged Shot
 * Sniper, High DMG(Lethal)
 *
 * Source: defender_ranged/archery/ranged_shot.json
 */

import type { Power } from '@/types';

export const RangedShot: Power = {
  "name": "Ranged Shot",
  "internalName": "Ranged_Shot",
  "available": 23,
  "description": "A long range shot that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: High.Recharge: Slow.",
  "shortHelp": "Sniper, High DMG(Lethal)",
  "icon": "archery_sniperarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.39,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 3.67
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 4.5,
    "table": "Ranged_Damage"
  },
  "quickSnipe": {
    "stats": {
      "castTime": 1.67,
      "range": 80,
      "accuracy": 1.16
    },
    "damage": {
      "type": "Lethal",
      "scale": 2.28,
      "table": "Ranged_Damage"
    }
  }
};
