/**
 * White Dwarf Flare
 * PBAoE Melee, Light DMG(Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const WhiteDwarfFlare: Power = {
  "name": "White Dwarf Flare",
  "available": 19,
  "description": "You channel the might of your Kheldian energy into the very Earth itself. The ground erupts and cracks with luminous energy, blasting all nearby foes, knocking them back and reducing their defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Energy), Foe -DEF, Knockback",
  "icon": "luminousaura_solarflare.png",
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
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.1,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self",
  "requires": "White Dwarf"
};
