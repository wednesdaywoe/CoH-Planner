/**
 * Focus
 * Ranged, DMG(Lethal), Knockback
 *
 * Source: brute_melee/claws/focus.json
 */

import type { Power } from '@/types';

export const Focus: Power = {
  "name": "Focus",
  "internalName": "Focus",
  "available": 17,
  "description": "Projects a burst of focused power over a short distance. Focus deals high damage and can possibly knock down your foe.",
  "shortHelp": "Ranged, DMG(Lethal), Knockback",
  "icon": "claws_focus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 8,
    "endurance": 8.1536,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.51,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.6795,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
