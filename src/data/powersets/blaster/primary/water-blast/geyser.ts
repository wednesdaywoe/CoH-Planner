/**
 * Geyser
 * Ranged (Targeted AoE), DMG(Fire/Smash), Foe DoT(Fire), +Wet, -Speed, Knock Up, Disorient, Self -Tidal Power
 *
 * Source: blaster_ranged/water_blast/geyser.json
 */

import type { Power } from '@/types';

export const Geyser: Power = {
  "name": "Geyser",
  "internalName": "Geyser",
  "available": 25,
  "description": "You cause the earth to erupt beneath your target's feet as a Geyser of scalding hot water burns your foes and tosses them violently into the air. Geyser causes Fire and Smashing damage before causing Fire damage over time as well as reducing their movement speed. Geyser consumes all Tidal Power. Both the initial damage and damage over time portions of this power will be increased and have a scaling chance to disorient for each stack of Tidal Power. If you have 3 stacks of Tidal Power, Geyser will have a 100% chance to disorient affected targets.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Smash), Foe DoT(Fire), +Wet, -Speed, Knock Up, Disorient, Self -Tidal Power",
  "icon": "waterblast_geyser.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "range": 80,
    "radius": 25,
    "recharge": 125,
    "endurance": 20.8,
    "castTime": 2.93,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.24,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1364,
      "table": "Ranged_Damage",
      "duration": 5.1,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1432,
      "table": "Ranged_Damage",
      "duration": 5.1,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1527,
      "table": "Ranged_Damage",
      "duration": 5.1,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1705,
      "table": "Ranged_Damage",
      "duration": 5.1,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Ranged_Stun"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.33,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.33,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.33,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.33,
        "table": "Ranged_Slow"
      }
    },
    "knockup": {
      "scale": 1.5,
      "table": "Ranged_Ones"
    }
  }
};
