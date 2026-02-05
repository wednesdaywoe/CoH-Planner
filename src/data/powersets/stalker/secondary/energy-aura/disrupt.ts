/**
 * Disrupt
 * Toggle: PBAoE, Foe Disorient
 *
 * Source: stalker_defense/energy_aura/repulse.json
 */

import type { Power } from '@/types';

export const Disrupt: Power = {
  "name": "Disrupt",
  "internalName": "Repulse",
  "available": 19,
  "description": "This Toggle power creates a field that periodically sends out waves of intense energy that overload nearby enemy senses leaving them briefly stunned. Disrupt drains a small amount of endurance for each foe it attempts to stun.",
  "shortHelp": "Toggle: PBAoE, Foe Disorient",
  "icon": "energyaura_disrupt.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 8,
    "endurance": 0.78,
    "castTime": 1.67,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 4,
      "table": "Melee_Stun"
    },
    "enduranceDrain": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
