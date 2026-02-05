/**
 * Repulsing Torrent
 * Ranged (Cone), DMG(Energy/Smash), Foe Knockback
 *
 * Source: brute_melee/kinetic_attack/repulsing_torrent.json
 */

import type { Power } from '@/types';

export const RepulsingTorrent: Power = {
  "name": "Repulsing Torrent",
  "internalName": "Repulsing_Torrent",
  "available": 7,
  "description": "Repulsing Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.",
  "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
  "icon": "kineticattack_repulsingtorrent.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2,
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
    "Brute Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.825,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.275,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.495,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Melee_Knockback"
    }
  }
};
