/**
 * Full Auto
 * Ranged (Cone), DMG(Lethal), +Special
 *
 * Source: blaster_ranged/assault_rifle/full_auto.json
 */

import type { Power } from '@/types';

export const FullAuto: Power = {
  "name": "Full Auto",
  "internalName": "Full_Auto",
  "available": 25,
  "description": "Opens up your assault rifle on Full Auto to lay down a massive spray of bullets at your target. Although very slow to reload, damage from this attack is massive, shredding all targets within the cone of effect. There's a chance you may land a lucky shot for extra damage.",
  "shortHelp": "Ranged (Cone), DMG(Lethal), +Special",
  "icon": "assaultweapons_arfullauto.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.35,
    "range": 80,
    "radius": 80,
    "arc": 1.5708,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 2.5,
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
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.2754,
      "table": "Ranged_Damage",
      "duration": 2,
      "tickRate": 0.2
    }
  ]
};
