/**
 * Deafening Wave
 * PBAoE Melee, DMG(Energy/Smash), Foe Chance for Hold
 *
 * Source: blaster_support/sonic_manipulation/deafening_wave.json
 */

import type { Power } from '@/types';

export const DeafeningWave: Power = {
  "name": "Deafening Wave",
  "internalName": "Deafening_Wave",
  "available": 15,
  "description": "You create a large field of sonic waves, causing damage to all foes around you. It has a moderate chance of causing migraines, leaving them shaking in pain and helpless.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, DMG(Energy/Smash), Foe Chance for Hold",
  "icon": "sonicmanipulation_deafeningcry.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
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
    "Blaster Archetype Sets",
    "Holds",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5477,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.5477,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Immobilize"
    }
  }
};
