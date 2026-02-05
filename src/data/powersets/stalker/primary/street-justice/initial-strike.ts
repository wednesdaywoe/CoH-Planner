/**
 * Initial Strike
 * Melee, Light DMG(Smash), Foe Disorient, Combo Builder
 *
 * Source: stalker_melee/brawling/initial_strike.json
 */

import type { Power } from '@/types';

export const InitialStrike: Power = {
  "name": "Initial Strike",
  "internalName": "Initial_Strike",
  "available": 0,
  "description": "You deliver a pair of lightning fast blows to your opponent in an effort to throw them off balance. Initial Strike deals Light Smashing damage and has a small chance to disorient your target. Initial Strike is a Combo Builder and adds 1 Combo Level.Damage: Light.Recharge: Very Fast.",
  "shortHelp": "Melee, Light DMG(Smash), Foe Disorient, Combo Builder",
  "icon": "brawling_initialstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.8
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
