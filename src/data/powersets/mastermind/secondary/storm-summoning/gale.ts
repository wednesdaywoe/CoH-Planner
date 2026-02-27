/**
 * Gale
 * Ranged (Cone), Minor DMG(Smash), Foe Knockback
 *
 * Source: mastermind_buff/storm_summoning/gale.json
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
    "endurance": 9.75,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 5,
      "table": "Ranged_Knockback"
    }
  }
};
