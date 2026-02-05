/**
 * Moment of Glory
 * Self +DMG, +Res(All DMG, Knock Back, Repel, Stun, Hold, Sleep, Immobilize), +DEF(All DMG), +Recovery
 *
 * Source: scrapper_defense/regeneration/moment_of_glory.json
 */

import type { Power } from '@/types';

export const MomentofGlory: Power = {
  "name": "Moment of Glory",
  "internalName": "Moment_of_Glory",
  "available": 29,
  "description": "When you activate this power, you deal increased damage, recover Endurance more quickly, gain Resistance and Defense to all damage types, and are highly resistant to Knock Back, Sleep, Disorient, Immobilization, and Hold effects.",
  "shortHelp": "Self +DMG, +Res(All DMG, Knock Back, Repel, Stun, Hold, Sleep, Immobilize), +DEF(All DMG), +Recovery",
  "icon": "regeneration_momentofglory.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 240,
    "endurance": 2.6,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification",
    "Resist Damage"
  ],
  "maxSlots": 6
};
