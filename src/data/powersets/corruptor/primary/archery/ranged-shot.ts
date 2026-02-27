/**
 * Ranged Shot
 * Sniper, Extreme DMG(Lethal)
 *
 * Source: corruptor_ranged/archery/ranged_shot.json
 */

import type { Power } from '@/types';

export const RangedShot: Power = {
  "name": "Ranged Shot",
  "internalName": "Ranged_Shot",
  "available": 17,
  "description": "A long range shot that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Lethal)",
  "icon": "archery_sniperarrow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.155,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.67
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
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
