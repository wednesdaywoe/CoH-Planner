/**
 * Photon Seekers
 * Summon Drones: Ranged Special, High DMG(Energy)
 *
 * Source: peacebringer_offensive/luminous_blast/photon_seekers.json
 */

import type { Power } from '@/types';

export const PhotonSeekers: Power = {
  "name": "Photon Seekers",
  "available": 23,
  "description": "You manifest 3 spheres of light from your Kheldian essence. These spheres will follow you until they detect an enemy target. The Photon Seekers will then zero in on their targets and detonate on impact. The explosion is small but devastating and may affect multiple foes if they are near the target.  Recharge: Long.",
  "shortHelp": "Summon Drones: Ranged Special, High DMG(Energy)",
  "icon": "luminousblast_photonseekers.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 2,
    "recharge": 180,
    "endurance": 31.2,
    "castTime": 2.03
  },
  "targetType": "Self",
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "duration": 60,
      "copyBoosts": true,
      "entities": [
        {
          "entity": "Pets_LightDrone1",
          "count": 1
        },
        {
          "entity": "Pets_LightDrone2",
          "count": 1
        },
        {
          "entity": "Pets_LightDrone3",
          "count": 1
        }
      ]
    }
  }
};
