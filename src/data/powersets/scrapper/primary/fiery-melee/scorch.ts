/**
 * Scorch
 * Melee, DMG(Fire)
 *
 * Source: scrapper_melee/fiery_melee/scorch.json
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
    "Scrapper Archetype Sets",
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
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.045,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ]
};
