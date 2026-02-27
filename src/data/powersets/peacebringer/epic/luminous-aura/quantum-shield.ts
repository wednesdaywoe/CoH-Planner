/**
 * Quantum Shield
 * Toggle: Self +Res(Energy, Negative)
 *
 * Source: peacebringer_defensive/luminous_aura/quantum_shield.json
 */

import type { Power } from '@/types';

export const QuantumShield: Power = {
  "name": "Quantum Shield",
  "available": 13,
  "description": "When you toggle on Quantum Shield, you become highly resistant to Energy and Negative damage.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Energy, Negative)",
  "icon": "luminousaura_quantumshield.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "targetType": "Self",
  "effects": {
    "resistance": {
      "energy": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
