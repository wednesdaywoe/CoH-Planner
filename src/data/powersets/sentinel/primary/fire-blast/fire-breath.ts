/**
 * Fire Breath
 * Ranged (Cone), DoT(Fire)
 *
 * Source: sentinel_ranged/fire_blast/fire_breath.json
 */

import type { Power } from '@/types';

export const FireBreath: Power = {
  "name": "Fire Breath",
  "internalName": "Fire_Breath",
  "available": 11,
  "description": "You can breathe forth a torrent of fire that burns all foes within its narrow cone. Very accurate and very deadly at medium range.Damage: High.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), DoT(Fire)",
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
    "maxTargets": 6
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
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.585,
    "table": "Ranged_Damage",
    "duration": 2.1,
    "tickRate": 1
  }
};
