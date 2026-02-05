/**
 * Impenetrable Mind
 * Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)
 *
 * Source: tanker_defense/psionic_armor/impenetrable_mind.json
 */

import type { Power } from '@/types';

export const ImpenetrableMind: Power = {
  "name": "Impenetrable Mind",
  "internalName": "Impenetrable_Mind",
  "available": 1,
  "description": "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusion, Knockback and Hold effects. Impenetrable Mind also grants moderate resistance to Psionic based attacks.",
  "shortHelp": "Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Knockback)",
  "icon": "psionicarmor_impenetrablemind.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6
};
