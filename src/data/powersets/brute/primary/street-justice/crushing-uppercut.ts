/**
 * Crushing Uppercut
 * Melee, DMG(Smash), Foe Knock Up, Disorient, Finisher
 *
 * Source: brute_melee/brawling/crushing_uppercut.json
 */

import type { Power } from '@/types';

export const CrushingUppercut: Power = {
  "name": "Crushing Uppercut",
  "internalName": "Crushing_Uppercut",
  "available": 25,
  "description": "You perform a jaw breaking Crushing Uppercut on your target inflicting Extreme Smashing damage and knocking them into the air. Crushing Uppercut will leave the target disoriented for a short time. Crushing Uppercut is a Finisher and will set your Combo Level to 0. It will deal additional damage and have a longer disorient duration dependent upon the current Combo Level. At Combo Level 3, Crushing Uppercut will have its disorient effect upgraded to a Hold effect.",
  "shortHelp": "Melee, DMG(Smash), Foe Knock Up, Disorient, Finisher",
  "icon": "brawling_crushinguppercut.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 13,
    "recharge": 25,
    "endurance": 14.352,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Holds",
    "Knockback",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "knockup": {
      "scale": 3,
      "table": "Melee_Knockback"
    }
  }
};
