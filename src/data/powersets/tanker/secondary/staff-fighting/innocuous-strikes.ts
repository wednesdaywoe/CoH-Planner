/**
 * Innocuous Strikes
 * Melee (Cone), DMG(Smash), Foe Immobilize, -Speed
 *
 * Source: tanker_melee/staff_fighting/innocuous_strikes.json
 */

import type { Power } from '@/types';

export const InnocuousStrikes: Power = {
  "name": "Innocuous Strikes",
  "internalName": "Innocuous_Strikes",
  "available": 27,
  "description": "You repeatedly batter your foes' feet and legs with a flurry of sweeps of your staff. This attack deals Smashing damage to all foes within its cone. All affected targets will have their movement speed reduced, with a chance of being immobilized briefly. While a form is active, this power will build one level of Perfection.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Cone), DMG(Smash), Foe Immobilize, -Speed",
  "icon": "stafffighting_innocuousstrikes.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "radius": 9,
    "arc": 1.5708,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 2.17,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Immobilize",
    "Melee AoE Damage",
    "Slow Movement",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
