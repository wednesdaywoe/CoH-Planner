/**
 * Radiant Strike
 * Melee, High DMG(Smash/Energy), Foe -DEF, Knockback, -Fly
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const RadiantStrike: Power = {
  "name": "Radiant Strike",
  "available": 5,
  "description": "The Radiant Strike is a slow melee attack, but makes up for it with superior damage. Radiant Strike releases Kheldian light on impact, which can Knock Back foes, bring down fliers, and reduce a target's Defense.  Damage: High. Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Smash/Energy), Foe -DEF, Knockback, -Fly",
  "icon": "luminousblast_radiantstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
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
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.07
  },
  "targetType": "Foe (Alive)"
};
