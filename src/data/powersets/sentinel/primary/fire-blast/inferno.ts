/**
 * Inferno
 * PBAoE, DMG(Fire/Smash), DoT(Fire)
 *
 * Source: sentinel_ranged/fire_blast/inferno.json
 */

import type { Power } from '@/types';

export const Inferno: Power = {
  "name": "Inferno",
  "internalName": "Inferno",
  "available": 25,
  "description": "Unleashes a massive fiery explosion to devastate all nearby enemies and set them ablaze. Inferno deals Extreme Fire damage to all nearby foes and inflicts Moderate Fire damage over time.Damage: Extreme.Recharge: Long.",
  "shortHelp": "PBAoE, DMG(Fire/Smash), DoT(Fire)",
  "icon": "fireblast_inferno.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.928,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 2.253,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ]
};
