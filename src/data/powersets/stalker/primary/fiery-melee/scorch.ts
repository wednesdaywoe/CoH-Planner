/**
 * Scorch
 * Melee, DMG(Fire)
 *
 * Source: stalker_melee/fiery_melee/scorch.json
 */

import type { Power } from '@/types';

export const Scorch: Power = {
  "name": "Scorch",
  "internalName": "Scorch",
  "available": 0,
  "description": "This power engulfs your hands in flames, and can ignite the target of your Scorching attack. Once on fire, the target will suffer damage over time.",
  "shortHelp": "Melee, DMG(Fire)",
  "icon": "fieryfray_targetedlightmelee.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1
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
  "damage": [
    {
      "type": "Fire",
      "scale": 0.84,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    }
  ]
};
