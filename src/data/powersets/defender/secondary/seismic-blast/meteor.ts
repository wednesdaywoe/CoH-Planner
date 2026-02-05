/**
 * Meteor
 * Ranged (Location AoE), DMG(Smash/Fire), Foe Knockback
 *
 * Source: defender_ranged/seismic_blast/meteor.json
 */

import type { Power } from '@/types';

export const Meteor: Power = {
  "name": "Meteor",
  "internalName": "Meteor",
  "available": 29,
  "description": "You call down a meteor strike from the sky at a specified location. All targets within 30' are caught in the blast radius, taking extreme damage and being knocked back.",
  "shortHelp": "Ranged (Location AoE), DMG(Smash/Fire), Foe Knockback",
  "icon": "seismicblast_meteor.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 90,
    "recharge": 170,
    "endurance": 27.7316,
    "castTime": 2.57
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Meteor",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Redirects.Seismic_Blast.Meteor"
      ],
      "duration": 10
    }
  }
};
