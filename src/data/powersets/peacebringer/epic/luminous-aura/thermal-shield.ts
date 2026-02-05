/**
 * Thermal Shield
 * Toggle: Self +Res(Fire, Cold)
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const ThermalShield: Power = {
  "name": "Thermal Shield",
  "available": 9,
  "description": "When you toggle on Thermal Shield, you emit tendrils of Kheldian energy that give you resistance to Fire and Cold damage.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Fire, Cold)",
  "icon": "luminousaura_thermalshield.png",
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
    "castTime": 0.67
  },
  "targetType": "Self"
};
