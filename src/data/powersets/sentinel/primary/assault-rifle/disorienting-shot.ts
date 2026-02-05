/**
 * Disorienting Shot
 * Ranged, DMG(Smash), Foe Disorient
 *
 * Source: sentinel_ranged/assault_rifle/beanbag.json
 */

import type { Power } from '@/types';

export const DisorientingShot: Power = {
  "name": "Disorienting Shot",
  "internalName": "Beanbag",
  "available": 0,
  "description": "Fires a single non lethal rubber bullet that can seriously Disorient a target. Deals average damage but renders most targets unable to attack for a good while.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, DMG(Smash), Foe Disorient",
  "icon": "assaultweapons_shotgunbeanbag.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 0.9
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.16,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 2.5,
      "table": "Ranged_Stun"
    }
  }
};
