/**
 * Assassin's Shock
 * Melee, DMG(Energy)
 *
 * Source: stalker_melee/electrical_melee/assassins_strike.json
 */

import type { Power } from '@/types';

export const AssassinsShock: Power = {
  "name": "Assassin's Shock",
  "internalName": "Assassins_Strike",
  "available": 5,
  "description": "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
  "shortHelp": "Melee, DMG(Energy)",
  "icon": "electricmelee_assassinstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
