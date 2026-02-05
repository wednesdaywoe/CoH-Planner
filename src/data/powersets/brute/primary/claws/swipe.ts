/**
 * Swipe
 * Melee, DMG(Lethal)
 *
 * Source: brute_melee/claws/swipe.json
 */

import type { Power } from '@/types';

export const Swipe: Power = {
  "name": "Swipe",
  "internalName": "Swipe",
  "available": 0,
  "description": "A quick Swipe with your claws. Does minor lethal damage, but has a quick recharge rate.",
  "shortHelp": "Melee, DMG(Lethal)",
  "icon": "claws_clawsswipe.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 2.4,
    "endurance": 3.4944,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.83,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.3735,
      "table": "Melee_Damage"
    }
  ],
  "requires": "!Brute_Defense.Shield_Defense && !Brute_Defense.Stone_Armor"
};
