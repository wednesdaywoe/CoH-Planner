/**
 * Buckshot
 * Ranged (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: sentinel_ranged/assault_rifle/buckshot.json
 */

import type { Power } from '@/types';

export const Buckshot: Power = {
  "name": "Buckshot",
  "internalName": "Buckshot",
  "available": 1,
  "description": "Good at close range. Fires a cone of Buckshot pellets and can knock some foes down.Damage: Moderate.Recharge: Moderate.",
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
    "endurance": 8.53,
    "castTime": 0.9,
    "maxTargets": 6
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
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.91,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.75,
      "table": "Ranged_Knockback"
    }
  }
};
