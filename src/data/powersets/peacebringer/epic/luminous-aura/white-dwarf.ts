/**
 * White Dwarf
 * Toggle: Shapeshift, Special
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const WhiteDwarf: Power = {
  "name": "White Dwarf",
  "available": 19,
  "description": "Kheldians are masters of energy and matter. A Peacebringer can transform into a massive unstoppable energy beast known as a White Dwarf. When you choose this power, you will have access to 6 other powers that can only be used while in this form. You will not be able to use any other powers while in White Dwarf form. White Dwarf has awesome resistance to all damage except Psionics, as well as controlling effects. White Dwarf also has improved HP and Endurance Recovery, but is limited to melee attacks.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Shapeshift, Special",
  "icon": "luminousaura_whitedwarf.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "EnduranceReduction",
    "Jump"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Leaping",
    "Leaping & Sprints",
    "Resist Damage",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 1,
    "endurance": 0.13
  },
  "targetType": "Self"
};
