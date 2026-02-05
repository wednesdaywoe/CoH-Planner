/**
 * Light Form
 * Self, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, Repel, All DMG but Psionics)
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const LightForm: Power = {
  "name": "Light Form",
  "available": 31,
  "description": "When you activate Light Form, you become pure Kheldian energy and are extremely resistant to most damage. You are also partially protected from some Disorient, Immobilization, Hold, Sleep, Knockback and Repel effects. Endurance recovery is also increased. Light Form costs little Endurance to activate, but when it wears off you are left exhausted, and drained of Hit Points and Endurance.  Recharge: Very Long.",
  "shortHelp": "Self, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, Repel, All DMG but Psionics)",
  "icon": "luminousaura_lightform.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 2.6,
    "castTime": 1.67
  },
  "targetType": "Self"
};
