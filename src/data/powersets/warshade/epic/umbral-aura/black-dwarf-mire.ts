/**
 * Black Dwarf Mire
 * PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +ACC
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const BlackDwarfMire: Power = {
  "name": "Black Dwarf Mire",
  "available": 19,
  "description": "Black Dwarf Mire can drain the essence of all nearby foes, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and Accuracy.  Damage: Light. Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +ACC",
  "icon": "umbralaura_blackdwarfmire.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "recharge": 20,
    "endurance": 15.6,
    "castTime": 0.73,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self",
  "requires": "Black Dwarf"
};
