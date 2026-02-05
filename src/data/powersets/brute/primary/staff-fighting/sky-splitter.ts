/**
 * Sky Splitter
 * Melee, DMG(Smash), Foe Knock Up, Disorient, -Fly, Consumes Perfection
 *
 * Source: brute_melee/staff_fighting/sky_splitter.json
 */

import type { Power } from '@/types';

export const SkySplitter: Power = {
  "name": "Sky Splitter",
  "internalName": "Sky_Splitter",
  "available": 25,
  "description": "You leap into the air and hammer your foe with an overhead bash from your staff. Sky Splitter deals Smashing damage, will knock the target into the air and will briefly disorient your target. While a form is active, this power will build one level of Perfection if the user has two or less levels, if the user has three levels of Perfection it will consume them and gain some benefit. 3 Levels of Perfection of Body will cause additional smashing damage and grant the user a bonus to damage resistance a short time. 3 Levels of Perfection of Mind will cause additional psionic damage and boost the user's chance to hit for a short time. 3 Levels of Perfection of Soul will cause additional energy damage and increase the user's regeneration and recovery rate briefly.",
  "shortHelp": "Melee, DMG(Smash), Foe Knock Up, Disorient, -Fly, Consumes Perfection",
  "icon": "stafffighting_skysplitter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
