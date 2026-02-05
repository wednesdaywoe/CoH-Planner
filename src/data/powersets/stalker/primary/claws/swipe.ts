/**
 * Swipe
 * Melee, DMG(Lethal)
 *
 * Source: stalker_melee/claws/swipe.json
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
    "recharge": 1.7,
    "endurance": 2.912,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.76,
    "table": "Melee_Damage"
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
