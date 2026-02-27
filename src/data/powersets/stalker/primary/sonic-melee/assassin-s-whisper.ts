/**
 * Assassin's Whisper
 * Melee, DMG(Energy/Smashing), Sleep, -Res(DMG)
 *
 * Source: stalker_melee/sonic_melee/assassins_resonance.json
 */

import type { Power } from '@/types';

export const AssassinsWhisper: Power = {
  "name": "Assassin's Whisper",
  "internalName": "Assassins_Resonance",
  "available": 5,
  "description": "A signature Stalker attack. This attack does superior energy and smashing damage on its own as a frontal attack and cannot be interrupted. However, if it is executed while you are Hidden, this attack will do tremendous damage, as you whisper at your unsuspecting foe. Affected target is likely to fall asleep and have their damage resistances lowered. This attack may be interrupted if you move or are attacked while executing this power and are hidden. Using this power while not hidden has a chance to critically hit equal to 33.3% times the number of stacks of Assassin's Focus. Using Assassin's Strike when not hidden will remove all stacks of Assassin's Focus regardless if you critically hit or not.",
  "shortHelp": "Melee, DMG(Energy/Smashing), Sleep, -Res(DMG)",
  "icon": "sonicmanipulation_assassins.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 1.77
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Sleep",
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
    "type": "Smashing",
    "scale": 8.5,
    "table": "Melee_Damage"
  }
};
