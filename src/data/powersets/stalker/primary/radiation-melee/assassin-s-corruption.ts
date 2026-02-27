/**
 * Assassin's Corruption
 * Melee, DMG(Smashing, Energy)
 *
 * Source: stalker_melee/radiation_melee/assassins_corruption.json
 */

import type { Power } from '@/types';

export const AssassinsCorruption: Power = {
  "name": "Assassin's Corruption",
  "internalName": "Assassins_Corruption",
  "available": 5,
  "description": "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you waylay your unsuspecting foe. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not. Assassin's Corruption also has a very high chance to inflict Contaminated while hidden and a high chance while unhidden. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "Melee, DMG(Smashing, Energy)",
  "icon": "radiationmelee_assassinsstrike.png",
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
    "Interrupt",
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
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 8.5,
    "table": "Melee_Damage"
  }
};
