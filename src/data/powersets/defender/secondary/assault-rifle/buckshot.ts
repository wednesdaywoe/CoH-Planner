/**
 * Buckshot
 * Ranged (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: defender_ranged/assault_rifle/buckshot.json
 */

import type { Power } from '@/types';

export const Buckshot: Power = {
  "name": "Buckshot",
  "internalName": "Buckshot",
  "available": 3,
  "description": "Good at close range. Fires a cone of Buckshot pellets and can knock some foes down.",
  "shortHelp": "Ranged (Cone), DMG(Lethal), Foe Knockback",
  "icon": "assaultweapons_shotgunbuckshot.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 10.192,
    "castTime": 0.9,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.91,
    "table": "Ranged_Damage"
  }
};
