/**
 * Stalagmites
 * Ranged (Targeted AoE), DMG(Lethal), Foe Disorient, -DEF
 *
 * Source: controller_control/earth_control/stalagmites.json
 */

import type { Power } from '@/types';

export const Stalagmites: Power = {
  "name": "Stalagmites",
  "internalName": "Stalagmites",
  "available": 11,
  "description": "You can cause Stalagmites to erupt all around an enemy, damaging all nearby foes. The Stalagmites deal minimal Lethal damage, and can Disorient all affected targets for a good while, as well as reduce their Defense. You must be on the ground to activate this power.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Lethal), Foe Disorient, -DEF",
  "icon": "earthgrasp_stalagmites.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.25,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.25,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
