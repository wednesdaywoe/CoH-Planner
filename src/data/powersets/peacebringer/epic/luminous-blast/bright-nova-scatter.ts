/**
 * Bright Nova Scatter
 * Ranged (Cone), Light DMG(Energy), Foe -DEF
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const BrightNovaScatter: Power = {
  "name": "Bright Nova Scatter",
  "available": 3,
  "description": "Bright Nova Scatter sends bolts of Kheldian light energy to multiple targets at once within a cone area in front of the caster. Bright Nova Scatter deals moderate energy damage to each affected target and reduces their defense. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Energy), Foe -DEF",
  "icon": "luminousblast_protonscatter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Kheldian Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.5,
    "radius": 60,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
