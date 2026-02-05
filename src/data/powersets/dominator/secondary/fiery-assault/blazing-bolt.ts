/**
 * Blazing Bolt
 * Sniper, Extreme DMG(Fire)
 *
 * Source: dominator_assault/fiery_assault/blazing_bolt.json
 */

import type { Power } from '@/types';

export const BlazingBolt: Power = {
  "name": "Blazing Bolt",
  "internalName": "Blazing_Bolt",
  "available": 27,
  "description": "A long range beam of fire that blasts your foes. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Fire)",
  "icon": "fireassault_blazingbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 20,
    "endurance": 18.512,
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
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
