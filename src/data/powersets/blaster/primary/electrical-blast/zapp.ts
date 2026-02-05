/**
 * Zapp
 * Sniper, DMG(Energy), Foe -End, Self +Range
 *
 * Source: blaster_ranged/electrical_blast/zapp.json
 */

import type { Power } from '@/types';

export const Zapp: Power = {
  "name": "Zapp",
  "internalName": "Zapp",
  "available": 11,
  "description": "A focused electrical blast that can travel great distances with high Accuracy. Zapp drains Endurance, and is best fired from a distance, as it can be interrupted. Some of the Endurance you drain may transfer back to you. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Energy), Foe -End, Self +Range",
  "icon": "electricalbolt_zapp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
