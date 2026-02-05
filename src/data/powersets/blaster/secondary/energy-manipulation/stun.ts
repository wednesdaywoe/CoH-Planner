/**
 * Stun
 * Melee, Minor DMG(Energy/Smashing), Foe Disorient, Special
 *
 * Source: blaster_support/energy_manipulation/stun.json
 */

import type { Power } from '@/types';

export const Stun: Power = {
  "name": "Stun",
  "internalName": "Stun",
  "available": 19,
  "description": "Stun deals a little bit of damage, but Disorients its target a great deal. This attack can Disorient most opponents. If this power is used under the effects of Boost Range, this power will become a ranged stun instead. If this power is used under the effect of Power Boost, it will become an AoE stun, but it will recharge in 90 seconds instead of 12. Both these effects can be combined for the power to become a ranged AoE stun.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Melee, Minor DMG(Energy/Smashing), Foe Disorient, Special",
  "icon": "energymanipulation_stun.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 10.192,
    "castTime": 1.8
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
