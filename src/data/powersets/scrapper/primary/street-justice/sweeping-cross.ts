/**
 * Sweeping Cross
 * Melee (Cone), DMG(Smash), Foe Disorient, Finisher
 *
 * Source: scrapper_melee/brawling/sweeping_cross.json
 */

import type { Power } from '@/types';

export const SweepingCross: Power = {
  "name": "Sweeping Cross",
  "internalName": "Sweeping_Cross",
  "available": 1,
  "description": "You execute a sweeping right hook that can strike multiple targets in your frontal arc. Sweeping Cross deals High Smashing damage and can disorient foes. Sweeping Cross is a Finisher and sets your current Combo Level to 0. It will deal additional damage and have a greater chance to disorient dependent upon the current Combo Level. At Combo Level 3, Sweeping Cross will also have a chance to knock down the affected targets. Critical damage is unaffected by your Combo Level.",
  "shortHelp": "Melee (Cone), DMG(Smash), Foe Disorient, Finisher",
  "icon": "brawling_sweepingcross.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.309,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
