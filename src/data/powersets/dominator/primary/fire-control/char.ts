/**
 * Char
 * Ranged, Moderate DoT(Fire), Foe Hold
 *
 * Source: dominator_control/fire_control/char.json
 */

import type { Power } from '@/types';

export const Char: Power = {
  "name": "Char",
  "internalName": "Char",
  "available": 0,
  "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot.",
  "shortHelp": "Ranged, Moderate DoT(Fire), Foe Hold",
  "icon": "firetrap_soot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.07
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.22,
    "table": "Ranged_Damage",
    "duration": 4.2,
    "tickRate": 1
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    }
  }
};
