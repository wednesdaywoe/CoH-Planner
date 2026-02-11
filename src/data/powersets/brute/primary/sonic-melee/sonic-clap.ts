/**
 * Sonic Clap
 * Melee (Cone), Foe Disorient, Knockdown
 *
 * Source: brute_melee/sonic_melee/sonic_clap.json
 */

import type { Power } from '@/types';

export const SonicClap: Power = {
  "name": "Sonic Clap",
  "internalName": "Sonic_Clap",
  "available": 7,
  "description": "You generate a powerful sonic wave that damages foes in front of you with a decent chance to stun and knock them down. This power will inflict a splash damage over time effect and 10% bonus damage against Attuned targets.",
  "shortHelp": "Melee (Cone), Foe Disorient, Knockdown",
  "icon": "sonicmanipulation_sonicclap.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "arc": 3.1416,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.23,
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
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.78,
    "table": "Melee_Damage"
  }
};
