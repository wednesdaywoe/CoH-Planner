/**
 * Gleaming Blast
 * Ranged, Moderate DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const GleamingBlast: Power = {
  "name": "Gleaming Blast",
  "available": 1,
  "description": "A much more powerful, yet slower version of Gleaming Bolt. Gleaming Blast sends a focused blast of Kheldian energy at a foe that can knock them back and reduce their Defense.  Damage: Moderate. Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousblast_gleamingblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
