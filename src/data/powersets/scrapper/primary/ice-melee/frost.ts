/**
 * Frost
 * Close (Cone), DoT(Cold), Foe -Recharge, -SPD
 *
 * Source: scrapper_melee/ice_melee/frost.json
 */

import type { Power } from '@/types';

export const Frost: Power = {
  "name": "Frost",
  "internalName": "Frost",
  "available": 1,
  "description": "You create a short cone of Frost in front of you that can deal some damage and Slow a foe's speed, due to their uncontrollable shivering.",
  "shortHelp": "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
  "icon": "icyonslaught_frost.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
    "arc": 1.5708,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 2.27,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Scrapper Archetype Sets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 0.27,
      "table": "Melee_Damage",
      "duration": 1.1,
      "tickRate": 0.2
    },
    {
      "type": "Cold",
      "scale": 1.404,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Cold",
      "scale": 1.404,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.1215,
      "table": "Melee_Damage",
      "duration": 1.1,
      "tickRate": 0.2
    }
  ],
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
