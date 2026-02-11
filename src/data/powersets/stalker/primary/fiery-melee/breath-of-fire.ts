/**
 * Breath of Fire
 * Close (Cone) DoT (Fire)
 *
 * Source: stalker_melee/fiery_melee/breath_of_fire.json
 */

import type { Power } from '@/types';

export const BreathofFire: Power = {
  "name": "Breath of Fire",
  "internalName": "Breath_of_Fire",
  "available": 17,
  "description": "This allows you to spew forth fire from your mouth, burning all foes within its narrow cone. This is a very accurate attack that can deal good damage at a close range.",
  "shortHelp": "Close (Cone) DoT (Fire)",
  "icon": "fieryfray_breathingfire.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.2,
    "range": 15,
    "radius": 15,
    "arc": 2.0944,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 2.4,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.68,
      "table": "Melee_Damage",
      "duration": 0.6,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ]
};
