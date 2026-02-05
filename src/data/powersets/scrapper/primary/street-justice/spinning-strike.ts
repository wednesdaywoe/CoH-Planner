/**
 * Spinning Strike
 * Melee (Targeted AoE), DMG(Smash), Foe Knockdown, Finisher
 *
 * Source: scrapper_melee/brawling/spinning_strike.json
 */

import type { Power } from '@/types';

export const SpinningStrike: Power = {
  "name": "Spinning Strike",
  "internalName": "Spinning_Strike",
  "available": 17,
  "description": "You execute a spinning attack that first strikes with your fist and finally your heel hitting your foe and all enemies immediately nearby. Spinning Strike deals Heavy Smashing damage and has a high chance to knockdown foes. Spinning Strike is a Finisher and sets your current Combo Level to 0. It will deal additional damage and have a greater chance to knockdown dependent upon the current Combo Level. At Combo Level 3, Spinning Strike also has a moderate chance to briefly inflict Terrorize in nearby foes. Critical damage is unaffected by your Combo Level.",
  "shortHelp": "Melee (Targeted AoE), DMG(Smash), Foe Knockdown, Finisher",
  "icon": "brawling_spinningstrike.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 6,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.8,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
