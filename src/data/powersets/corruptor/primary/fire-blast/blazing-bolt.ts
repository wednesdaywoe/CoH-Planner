/**
 * Blazing Bolt
 * Sniper, DMG(Fire)
 *
 * Source: corruptor_ranged/fire_blast/blazing_bolt.json
 */

import type { Power } from '@/types';

export const BlazingBolt: Power = {
  "name": "Blazing Bolt",
  "internalName": "Blazing_Bolt",
  "available": 21,
  "description": "A long range beam of fire that blasts your foes. Like most sniper attacks, this power has a bonus to Accuracy, but is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Fire)",
  "icon": "fireblast_blazingbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
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
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
