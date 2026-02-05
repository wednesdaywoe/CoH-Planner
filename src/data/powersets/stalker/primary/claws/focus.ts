/**
 * Focus
 * Ranged, DMG(Lethal), Knockback
 *
 * Source: stalker_melee/claws/focus.json
 */

import type { Power } from '@/types';

export const Focus: Power = {
  "name": "Focus",
  "internalName": "Focus",
  "available": 17,
  "description": "Projects a burst of Focused power over a short distance. Focus deals high lethal damage and can possibly knock down your foe.",
  "shortHelp": "Ranged, DMG(Lethal), Knockback",
  "icon": "claws_focus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 6.4,
    "endurance": 6.8224,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.39,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
