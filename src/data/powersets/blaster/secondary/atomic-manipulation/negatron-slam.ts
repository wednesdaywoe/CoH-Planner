/**
 * Negatron Slam
 * Melee, DMG(Energy/Smash), Foe Knockdown, -DEF, Special, +Negatrons
 *
 * Source: blaster_support/radiation_manipulation/negatron_slam.json
 */

import type { Power } from '@/types';

export const NegatronSlam: Power = {
  "name": "Negatron Slam",
  "internalName": "Negatron_Slam",
  "available": 0,
  "description": "You channel a greater amount of radiation into your fists and deliver a hard-hitting blow that deals Energy and Smashing damage to the target as well as reduce their Defense for a short time. The affected target will also be surrounded in negatively charged particles. Hitting a foe that has positive charged particles will trigger a Gamma Burst.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Knockdown, -DEF, Special, +Negatrons",
  "icon": "atomicmanipulation_weakpunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
