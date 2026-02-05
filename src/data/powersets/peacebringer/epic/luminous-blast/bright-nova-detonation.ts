/**
 * Bright Nova Detonation
 * Ranged (Targeted AoE), Light DMG(Smash/Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const BrightNovaDetonation: Power = {
  "name": "Bright Nova Detonation",
  "available": 3,
  "description": "You hurl a large blast of Kheldian light energy that violently explodes on impact, damaging all foes near the target, reducing their defense. Some affected targets may get knocked back. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Light DMG(Smash/Energy), Foe -DEF, Knockback",
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
    "range": 100,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.5,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
