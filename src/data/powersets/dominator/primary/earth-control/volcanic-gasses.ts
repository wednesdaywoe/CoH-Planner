/**
 * Volcanic Gasses
 * Ranged (Location AoE), Foe Hold, DoT(Fire), Special
 *
 * Source: dominator_control/earth_control/volcanic_gasses.json
 */

import type { Power } from '@/types';

export const VolcanicGasses: Power = {
  "name": "Volcanic Gasses",
  "internalName": "Volcanic_Gasses",
  "available": 21,
  "description": "You can tap into the geothermal power of the Earth and focus it at a targeted location. Foes that pass near a thermal vent will take minor Fire damage and be overcome by the gasses, leaving them choking and helpless.",
  "shortHelp": "Ranged (Location AoE), Foe Hold, DoT(Fire), Special",
  "icon": "earthgrasp_volcanicgasses.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.4,
    "range": 60,
    "recharge": 240,
    "endurance": 18.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Holds",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Volcanicgeyser",
      "duration": 10
    }
  }
};
