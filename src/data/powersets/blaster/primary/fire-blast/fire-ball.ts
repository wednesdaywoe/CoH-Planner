/**
 * Fire Ball
 * Ranged (Targeted AoE), DMG(Fire/Smash)
 *
 * Source: blaster_ranged/fire_blast/fire_ball.json
 */

import type { Power } from '@/types';

export const FireBall: Power = {
  "name": "Fire Ball",
  "internalName": "Fire_Ball",
  "available": 1,
  "description": "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Smash)",
  "icon": "fireblast_fireball.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.2,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.7,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.15,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
