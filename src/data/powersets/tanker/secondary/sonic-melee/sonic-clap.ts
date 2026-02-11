/**
 * Sonic Clap
 * Melee (Cone), Foe Disorient, Knockdown
 *
 * Source: tanker_melee/sonic_melee/sonic_clap.json
 */

import type { Power } from '@/types';

export const SonicClap: Power = {
  "name": "Sonic Clap",
  "internalName": "Sonic_Clap",
  "available": 15,
  "description": "You generate a powerful sonic wave that damages foes in front of you with a decent chance to stun and knock them down. This power will inflict a splash damage over time effect and 10% bonus damage against Attuned targets.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Cone), Foe Disorient, Knockdown",
  "icon": "sonicmanipulation_sonicclap.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 22.5,
    "radius": 22.5,
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
    "Knockback",
    "Melee AoE Damage",
    "Stuns",
    "Tanker Archetype Sets",
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
