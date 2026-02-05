/**
 * Direct Strike
 * Sniper, DMG(Energy), Foe -End, Special
 *
 * Source: corruptor_ranged/storm_blast/direct_strike.json
 */

import type { Power } from '@/types';

export const DirectStrike: Power = {
  "name": "Direct Strike",
  "internalName": "Direct_Strike",
  "available": 11,
  "description": "You channel your storm powers into a direct hit, jolting the enemy with a bolt of lightning that deals Energy damage and saps some endurance. If fired outside of combat, it can be interrupted by enemies, but will do bonus damage. If you are engaged in battle, this attack becomes instant-cast. While in a Storm Cell, targets have a chance to be stunned. The odds of creating High Winds and Lightning are much greater when Direct Strike is cast out of combat.",
  "shortHelp": "Sniper, DMG(Energy), Foe -End, Special",
  "icon": "stormblast_directstrike.png",
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
    "Corruptor Archetype Sets",
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
