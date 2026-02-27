/**
 * Repulsing Torrent
 * Ranged (Cone), DMG(Energy/Smash), Foe Knockback
 *
 * Source: tanker_melee/kinetic_attack/repulsing_torrent.json
 */

import type { Power } from '@/types';

export const RepulsingTorrent: Power = {
  "name": "Repulsing Torrent",
  "internalName": "Repulsing_Torrent",
  "available": 15,
  "description": "Repulsing Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
  "icon": "kineticattack_repulsingtorrent.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 0.7854,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.3225,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.9675,
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
      "scale": 1,
      "table": "Melee_Knockback"
    },
    "damageDebuff": {
      "scale": 0.7,
      "table": "Melee_Debuff_Dam"
    }
  }
};
