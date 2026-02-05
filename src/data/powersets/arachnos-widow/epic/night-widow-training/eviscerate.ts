/**
 * Eviscerate
 * Melee (Cone), DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: arachnos-widow/night-widow-training
 */

import type { Power } from '@/types';

export const Eviscerate: Power = {
  "name": "Eviscerate",
  "available": 21,
  "description": "Eviscerate does superior lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power may deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "Melee (Cone), DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "nightwidowtraining_eviscerate.png",
  "powerType": "Click",
  "effectArea": "Cone",
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
    "range": 7,
    "recharge": 12,
    "endurance": 13.548,
    "castTime": 2.33,
    "radius": 7,
    "maxTargets": 5
  },
  "targetType": "Foe (Alive)"
};
