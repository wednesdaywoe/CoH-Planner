/**
 * Deafening Wave
 * PBAoE Melee, DMG(Energy/Smash), Foe Chance for Hold
 *
 * Source: stalker_melee/sonic_melee/deafening_wave.json
 */

import type { Power } from '@/types';

export const DeafeningWave: Power = {
  "name": "Deafening Wave",
  "internalName": "Deafening_Wave",
  "available": 21,
  "description": "You create a large field of sonic waves, causing damage to all foes around you. It has a moderate chance of causing migraines, leaving them shaking in pain and helpless. This power will inflict a splash damage over time effect and 10% bonus damage against Attuned targets.",
  "shortHelp": "PBAoE Melee, DMG(Energy/Smash), Foe Chance for Hold",
  "icon": "sonicmanipulation_deafeningcry.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.85,
    "table": "Melee_Damage"
  }
};
