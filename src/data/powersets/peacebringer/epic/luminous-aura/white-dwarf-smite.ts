/**
 * White Dwarf Smite
 * Melee, Light DMG(Energy/Smash), Foe -DEF, -Fly, Disorient
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const WhiteDwarfSmite: Power = {
  "name": "White Dwarf Smite",
  "available": 19,
  "description": "White Dwarf Smite is powerful melee attack that can often Disorient or Knock Down opponents. White Dwarf Smite can also bring down fliers, and reduce their defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Energy/Smash), Foe -DEF, -Fly, Disorient",
  "icon": "luminousaura_whitedwarfsmite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
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
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf"
};
