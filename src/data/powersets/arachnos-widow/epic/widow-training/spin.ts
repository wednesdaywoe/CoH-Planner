/**
 * Spin
 * PBAoE Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: arachnos-widow/widow-training
 */

import type { Power } from '@/types';

export const Spin: Power = {
  "name": "Spin",
  "available": 11,
  "description": "Spin does moderate lethal damage to all foes within an 8' radius of you, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power may deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "PBAoE Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "widowtraining_spin.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 14,
    "endurance": 15.451,
    "castTime": 2.5,
    "radius": 8,
    "maxTargets": 10
  },
  "targetType": "Self"
};
