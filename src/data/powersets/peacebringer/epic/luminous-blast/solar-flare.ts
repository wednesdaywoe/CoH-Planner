/**
 * Solar Flare
 * PBAoE Melee, Moderate DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-blast
 */

import type { Power } from '@/types';

export const SolarFlare: Power = {
  "name": "Solar Flare",
  "available": 21,
  "description": "You channel the might of your Kheldian energy into the very Earth itself. The ground erupts and cracks with luminous energy, blasting all nearby foes, knocking them back and reducing their Defense.  Damage: Moderate. Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Moderate DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousblast_solarflare.png",
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
    "accuracy": 1,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.1,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self"
};
