/**
 * Trick Shot
 * Ranged, Chain Light DMG(Lethal)
 *
 * Source: dominator_assault/martial_assault/trick_shot.json
 */

import type { Power } from '@/types';

export const TrickShot: Power = {
  "name": "Trick Shot",
  "internalName": "Trick_Shot",
  "available": 3,
  "description": "You take careful aim and bounce a thrown shuriken between multiple targets.Notes: Trick Shot is unaffected by Range changes.Damage: Light.Recharge: Moderate.",
  "shortHelp": "Ranged, Chain Light DMG(Lethal)",
  "icon": "martialassault_trickshot.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 20,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.07,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.1,
    "table": "Ranged_Damage"
  }
};
