/**
 * Gale
 * Ranged (Cone), Minor DMG(Smash), Foe Knockback
 *
 * Source: corruptor_buff/storm_summoning/gale.json
 */

import type { Power } from '@/types';

export const Gale: Power = {
  "name": "Gale",
  "internalName": "Gale",
  "available": 0,
  "description": "You can call forth a tremendous gust of Gale force winds that knock down foes and deal some Smashing damage in a wide cone area.Damage: Minor.Recharge: Moderate.",
  "shortHelp": "Ranged (Cone), Minor DMG(Smash), Foe Knockback",
  "icon": "stormsummoning_gale.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 0.9,
    "range": 50,
    "radius": 50,
    "arc": 1.3963,
    "recharge": 8,
    "endurance": 7.8,
    "castTime": 2.17,
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
    "Corruptor Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 5,
      "table": "Ranged_Knockback"
    }
  }
};
