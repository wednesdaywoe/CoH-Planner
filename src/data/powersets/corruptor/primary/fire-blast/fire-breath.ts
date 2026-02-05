/**
 * Fire Breath
 * Close (Cone), DoT(Fire)
 *
 * Source: corruptor_ranged/fire_blast/fire_breath.json
 */

import type { Power } from '@/types';

export const FireBreath: Power = {
  "name": "Fire Breath",
  "internalName": "Fire_Breath",
  "available": 7,
  "description": "You can breathe forth a torrent of fire that burns all foes within its narrow cone. Very accurate and very deadly at medium range.",
  "shortHelp": "Close (Cone), DoT(Fire)",
  "icon": "fireblast_arcoffire.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.2,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.67,
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
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.585,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.585,
      "table": "Ranged_InherentDamage",
      "duration": 2.1,
      "tickRate": 1
    }
  ]
};
