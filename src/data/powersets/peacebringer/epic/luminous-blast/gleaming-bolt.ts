/**
 * Gleaming Bolt
 * Ranged, Minor DMG(Energy), Foe -DEF
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const GleamingBolt: Power = {
  "name": "Gleaming Bolt",
  "available": 0,
  "description": "A very quick, but low damage bolt of Kheldian energy that can reduce a target's Defense. This power can be used while in Dwarf form, although only at a reduced range. While in dwarf form, this power will inflict a stronger Defense debuff, in addition to taunt its target.  Damage: Minor. Recharge: Very Fast.",
  "shortHelp": "Ranged, Minor DMG(Energy), Foe -DEF",
  "icon": "luminousblast_gleamingbolt.png",
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
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
