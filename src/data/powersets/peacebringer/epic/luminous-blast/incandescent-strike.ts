/**
 * Incandescent Strike
 * Melee, Extreme DMG(Energy/Smash), Foe -DEF, -Fly, Hold
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const IncandescentStrike: Power = {
  "name": "Incandescent Strike",
  "available": 15,
  "description": "Incandescent Strike is an absolutely devastating melee attack that focuses all of the Kheldian's energy and strength into a single massive blow. This slow but incredibly devastating attack can knock out most opponents, leaving them Held. Incandescent Strike can also bring down fliers, Knock Down foes, and reduce their Defense.  Damage: Extreme. Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Energy/Smash), Foe -DEF, -Fly, Hold",
  "icon": "luminousblast_incandescentstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Holds",
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 3.3
  },
  "targetType": "Foe (Alive)"
};
