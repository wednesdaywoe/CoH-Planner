/**
 * Black Dwarf
 * Toggle: Shapeshift, Special
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const BlackDwarf: Power = {
  "name": "Black Dwarf",
  "available": 19,
  "description": "Kheldians are masters of energy and matter. A Warshade can transform into a massive unstoppable essence draining beast known as a Black Dwarf. When you choose this power, you will have access to 6 other powers that can only be used while in this form. You will not be able to use any other powers while in Black Dwarf form. Black Dwarf has awesome resistance to all damage except Psionics, as well as controlling effects. Black Dwarf also has improved HP and Endurance Recovery, but is limited to melee attacks.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Shapeshift, Special",
  "icon": "umbralaura_blackdwarf.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "EnduranceReduction",
    "Recharge",
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
