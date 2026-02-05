/**
 * Explosive Shuriken
 * Ranged, Superior DMG(Fire), Minor Splash Damage (Fire DoT)
 *
 * Source: dominator_assault/martial_assault/explosive_shuriken.json
 */

import type { Power } from '@/types';

export const ExplosiveShuriken: Power = {
  "name": "Explosive Shuriken",
  "internalName": "Explosive_Shuriken",
  "available": 29,
  "description": "You rig a shuriken with a powerful explosive, then send it flying towards your enemies.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Ranged, Superior DMG(Fire), Minor Splash Damage (Fire DoT)",
  "icon": "martialassault_explosiveshuriken.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.67
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
    "type": "Fire",
    "scale": 2.28,
    "table": "Ranged_Damage"
  }
};
