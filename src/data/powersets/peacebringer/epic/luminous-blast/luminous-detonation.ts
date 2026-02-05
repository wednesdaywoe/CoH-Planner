/**
 * Luminous Detonation
 * Ranged (Targeted AoE), Light DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const LuminousDetonation: Power = {
  "name": "Luminous Detonation",
  "available": 11,
  "description": "You hurl a large blast of Kheldian energy that violently explodes on impact, damaging all foes near the target, and reducing their Defense. Some affected targets may get knocked back.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Light DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousblast_luminousdetonation.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)"
};
