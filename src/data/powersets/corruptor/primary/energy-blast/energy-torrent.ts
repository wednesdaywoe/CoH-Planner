/**
 * Energy Torrent
 * Ranged (Cone), DMG(Energy/Smash), Foe Knockback
 *
 * Source: corruptor_ranged/energy_blast/energy_torrent.json
 */

import type { Power } from '@/types';

export const EnergyTorrent: Power = {
  "name": "Energy Torrent",
  "internalName": "Energy_Torrent",
  "available": 1,
  "description": "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.",
  "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
  "icon": "powerblast_energytorrent.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.7854,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.07,
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
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.66,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Ranged_Knockback"
    }
  }
};
