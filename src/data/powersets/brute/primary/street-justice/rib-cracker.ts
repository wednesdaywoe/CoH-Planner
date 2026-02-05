/**
 * Rib Cracker
 * Melee, DMG(Smash), Foe -Res (All), -Dmg, Combo Builder
 *
 * Source: brute_melee/brawling/throat_strike.json
 */

import type { Power } from '@/types';

export const RibCracker: Power = {
  "name": "Rib Cracker",
  "internalName": "Throat_Strike",
  "available": 7,
  "description": "You deftly strike your foe in a very vulnerable location. Rib Cracker deals Moderate Damage but reduces your foe's Damage and Resistance moderately for a short time. Rib Cracker is a Combo Builder and adds 1 Combo Level.",
  "shortHelp": "Melee, DMG(Smash), Foe -Res (All), -Dmg, Combo Builder",
  "icon": "brawling_throatstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
