/**
 * Tremor
 * PBAoE, DMG(Smashing), Knockback
 *
 * Source: scrapper_melee/stone_melee/tremor.json
 */

import type { Power } from '@/types';

export const Tremor: Power = {
  "name": "Tremor",
  "internalName": "Tremor",
  "available": 25,
  "description": "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range while knocking them back.",
  "shortHelp": "PBAoE, DMG(Smashing), Knockback",
  "icon": "stonemelee_tremor.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.04,
    "table": "Melee_Damage"
  }
};
