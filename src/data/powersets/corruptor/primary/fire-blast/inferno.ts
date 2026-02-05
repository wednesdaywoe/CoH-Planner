/**
 * Inferno
 * PBAoE, DMG(Fire/Smash), Foe DoT(Fire)
 *
 * Source: corruptor_ranged/fire_blast/inferno.json
 */

import type { Power } from '@/types';

export const Inferno: Power = {
  "name": "Inferno",
  "internalName": "Inferno",
  "available": 25,
  "description": "Unleashes a massive fiery explosion to devastate all nearby enemies and set them ablaze. Inferno deals Extreme Fire damage to all nearby foes and inflicts Moderate Fire damage over time.",
  "shortHelp": "PBAoE, DMG(Fire/Smash), Foe DoT(Fire)",
  "icon": "fireblast_inferno.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 25,
    "recharge": 145,
    "endurance": 27.7316,
    "castTime": 3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.3,
      "table": "Ranged_Damage",
      "duration": 8.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 2,
      "table": "Ranged_InherentDamage"
    }
  ]
};
