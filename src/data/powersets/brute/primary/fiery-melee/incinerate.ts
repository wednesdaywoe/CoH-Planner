/**
 * Incinerate
 * Melee, DoT (Fire)
 *
 * Source: brute_melee/fiery_melee/incinerate.json
 */

import type { Power } from '@/types';

export const Incinerate: Power = {
  "name": "Incinerate",
  "internalName": "Incinerate",
  "available": 7,
  "description": "Intense concentration can allow you to Incinerate an opponent. This will set your foe ablaze, dealing very high damage over a short time.",
  "shortHelp": "Melee, DoT (Fire)",
  "icon": "fieryfray_incinerate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 6.864,
    "castTime": 1.67
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
  "damage": {
    "type": "Fire",
    "scale": 0.25,
    "table": "Melee_Damage",
    "duration": 4.6,
    "tickRate": 0.5
  }
};
