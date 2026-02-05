/**
 * Precise Strike
 * Melee, Liht DMG(Smash), Foe Disorient
 *
 * Source: stalker_melee/staff_fighting/precise_strike.json
 */

import type { Power } from '@/types';

export const PreciseStrike: Power = {
  "name": "Precise Strike",
  "internalName": "Precise_Strike",
  "available": 0,
  "description": "You attempt to daze your foe with a heavy staff blow to their head. Precise Strike has a higher chance to hit than normal, deals Smashing damage, and has a small chance to disorient the target briefly. This power grants one stack of Perfection of Body.",
  "shortHelp": "Melee, Liht DMG(Smash), Foe Disorient",
  "icon": "stafffighting_precisestrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 9,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.13
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
  "maxSlots": 6,
  "requires": "!Stalker_Defense.Shield_Defense"
};
