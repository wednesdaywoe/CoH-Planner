/**
 * Glinting Eye
 * Ranged, Moderate DMG(Energy), Foe -DEF
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const GlintingEye: Power = {
  "name": "Glinting Eye",
  "available": 0,
  "description": "You can emit a beam of Kheldian energy from your eyes, dealing moderate Energy damage and reducing a target's Defense. This power can be used while in Nova form at an increased range and with higher damage but slower recharge.  Damage: Moderate. Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DMG(Energy), Foe -DEF",
  "icon": "luminousblast_glintingeye.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
