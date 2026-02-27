/**
 * Power Siphon
 * Self: +To Hit, +Special
 *
 * Source: tanker_melee/kinetic_attack/power_siphon.json
 */

import type { Power } from '@/types';

export const PowerSiphon: Power = {
  "name": "Power Siphon",
  "internalName": "Power_Siphon",
  "available": 19,
  "description": "Power Siphon adds a small bonus to hit and modifies your other Kinetic Attack powers, so they are now capable of draining the strength of your enemies and adding that strength to you. This effect will stack up to 5 times.",
  "shortHelp": "Self: +To Hit, +Special",
  "icon": "kineticattack_powersiphon.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 0.75,
      "table": "Melee_Buff_ToHit"
    }
  }
};
