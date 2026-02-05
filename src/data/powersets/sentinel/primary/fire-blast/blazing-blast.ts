/**
 * Blazing Blast
 * Ranged, DMG(Fire), DoT(Fire), Foe Knockback, Repel
 *
 * Source: sentinel_ranged/fire_blast/blazing_blast.json
 */

import type { Power } from '@/types';

export const BlazingBlast: Power = {
  "name": "Blazing Blast",
  "internalName": "Blazing_Blast",
  "available": 17,
  "description": "An extremely quick long range beam of fire that blasts your foes and pushes them away.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Ranged, DMG(Fire), DoT(Fire), Foe Knockback, Repel",
  "icon": "fireblast_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "repel": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 4,
      "table": "Ranged_Ones"
    },
    "effectDuration": 0.61,
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    }
  }
};
