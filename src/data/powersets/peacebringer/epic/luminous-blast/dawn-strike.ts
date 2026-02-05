/**
 * Dawn Strike
 * PBAoE, Extreme DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const DawnStrike: Power = {
  "name": "Dawn Strike",
  "available": 25,
  "description": "You can explode in a tremendous blast of Kheldian energy, sending nearby foes flying and reducing their defense. Dawn Strike deals massive damage to all nearby foes.  Damage: Extreme. Recharge: Long.",
  "shortHelp": "PBAoE, Extreme DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousblast_dawnstrike.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
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
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.4,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 3,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Self"
};
