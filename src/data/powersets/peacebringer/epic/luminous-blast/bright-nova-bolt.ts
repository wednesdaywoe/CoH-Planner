/**
 * Bright Nova Bolt
 * Ranged, Minor DMG(Energy), Foe -DEF
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const BrightNovaBolt: Power = {
  "name": "Bright Nova Bolt",
  "available": 3,
  "description": "A very quick, but low damage bolt of Kheldian energy that can reduce a target's defense. This power is only available while in Bright Nova Form.  Damage: Minor. Recharge: Very Fast.",
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
    "range": 100,
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
