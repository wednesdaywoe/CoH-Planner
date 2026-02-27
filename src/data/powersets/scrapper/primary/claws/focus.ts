/**
 * Focus
 * Ranged, DMG(Lethal), Knockback
 *
 * Source: scrapper_melee/claws/focus.json
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
    "recharge": 6.4,
    "endurance": 6.8224,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.39,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.39,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.39,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.6255,
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
