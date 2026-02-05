/**
 * Indomitable Will
 * Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback).
 *
 * Source: arachnos-widow/teamwork
 */

import type { Power } from '@/types';

export const IndomitableWill: Power = {
  "name": "Indomitable Will",
  "available": 9,
  "description": "When you toggle on this power, it grants protection from Sleep, Disorient, Fear, Immobilize, Confusions, Repel, Knockback and Hold effects. Indomitable Will also grants moderate resistance to Psionic based attacks.",
  "shortHelp": "Toggle: Self Res (Psionics, Disorient, Hold, Immobilize, Sleep, Fear, Confuse, Repel, Knockback).",
  "icon": "teamwork_indomitablewill.png",
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
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 0.73
  },
  "targetType": "Self"
};
