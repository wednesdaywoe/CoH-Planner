/**
 * Slash
 * Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: arachnos-widow/night-widow-training
 */

import type { Power } from '@/types';

export const Slash: Power = {
  "name": "Slash",
  "available": 17,
  "description": "Slash does extreme lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "nightwidowtraining_slash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 14.272,
    "castTime": 1.33
  },
  "targetType": "Foe (Alive)"
};
