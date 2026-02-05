/**
 * Beanbag
 * Ranged, Minor DMG(Smash), Foe Disorient
 *
 * Source: corruptor_ranged/assault_rifle/beanbag.json
 */

import type { Power } from '@/types';

export const Beanbag: Power = {
  "name": "Beanbag",
  "internalName": "Beanbag",
  "available": 7,
  "description": "Fires a single non lethal Beanbag that can seriously Disorient a target. Deals little damage and takes a long time to reload, but renders most targets unable to attack for a good while.Damage: Minor.Recharge: Slow.",
  "shortHelp": "Ranged, Minor DMG(Smash), Foe Disorient",
  "icon": "assaultweapons_shotgunbeanbag.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 10,
    "endurance": 10.192,
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
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.98,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.98,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
