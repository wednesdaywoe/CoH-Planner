/**
 * Dazzle
 * Ranged, Moderate DMG (Fire, Energy), Foe Hold, Chance for Blast Off
 *
 * Source: dominator_control/pyrotechnic_control/dazzle.json
 */

import type { Power } from '@/types';

export const Dazzle: Power = {
  "name": "Dazzle",
  "internalName": "Dazzle",
  "available": 0,
  "description": "Incapacitates a distant foe with a brilliant explosion of pyrotechnic energy. The target is left helpless for the duration.This power has a chance of Blasting Off targets into the air.",
  "shortHelp": "Ranged, Moderate DMG (Fire, Energy), Foe Hold, Chance for Blast Off",
  "icon": "pyrotechnic_dazzle.png",
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
  "damage": [
    {
      "type": "Fire",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.5,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    }
  }
};
