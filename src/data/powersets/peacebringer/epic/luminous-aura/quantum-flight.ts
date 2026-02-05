/**
 * Quantum Flight
 * Toggle: Self Fly, Intangible
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const QuantumFlight: Power = {
  "name": "Quantum Flight",
  "available": 27,
  "description": "You shift your quantum matrix and become more energy than matter. No longer bound by the laws of normal physics, you become intangible to other entities and can fly at high speeds. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Quantum Flight offers greater flight speed and some stealth, but costs more endurance.  Quantum Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.  Recharge: Slow.",
  "shortHelp": "Toggle: Self Fly, Intangible",
  "icon": "luminousaura_quantumflight.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 0.325
  },
  "targetType": "Self"
};
