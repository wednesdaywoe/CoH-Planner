/**
 * Eviscerate
 * Melee, DMG(Lethal), +Special
 *
 * Source: stalker_melee/claws/eviscerate.json
 */

import type { Power } from '@/types';

export const Eviscerate: Power = {
  "name": "Eviscerate",
  "internalName": "Eviscerate",
  "available": 21,
  "description": "You spin and slash violently at the foe in front of you. This attack deals exceptional damage, and has a high chance of landing a critical hit even while not hidden.",
  "shortHelp": "Melee, DMG(Lethal), +Special",
  "icon": "claws_stalkereviscerate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8.867,
    "endurance": 8.8749,
    "castTime": 2.33
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
    "scale": 2.23,
    "table": "Melee_Damage"
  }
};
