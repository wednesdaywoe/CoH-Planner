/**
 * Buttstroke
 * Melee, DMG(Smash), Foe Disorient
 *
 * Source: dominator_assault/arsenal_assault/buttstroke.json
 */

import type { Power } from '@/types';

export const Buttstroke: Power = {
  "name": "Buttstroke",
  "internalName": "Buttstroke",
  "available": 0,
  "description": "A smash with the butt of your rifle with a high chance of disorienting.",
  "shortHelp": "Melee, DMG(Smash), Foe Disorient",
  "icon": "assaultweapons_riflebutt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.64,
    "table": "Melee_Damage"
  }
};
