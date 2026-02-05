/**
 * Black Dwarf Smite
 * Melee, Light DMG(Negative/Smash), Foe -Recharge, -SPD, -Fly, Disorient
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const BlackDwarfSmite: Power = {
  "name": "Black Dwarf Smite",
  "available": 19,
  "description": "Black Dwarf Smite is powerful melee attack that can often Disorient or Knock Down opponents. Black Dwarf Smite can also bring down fliers, and slows a targets attack and movement speed. This power is only available while in Black Dwarf Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Negative/Smash), Foe -Recharge, -SPD, -Fly, Disorient",
  "icon": "umbralaura_blackdwarfsmite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Slow Movement",
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
  "requires": "Black Dwarf"
};
