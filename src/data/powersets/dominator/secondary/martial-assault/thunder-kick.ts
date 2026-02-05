/**
 * Thunder Kick
 * Melee, Moderate DMG(Smash), Minor Disorient
 *
 * Source: dominator_assault/martial_assault/thunder_kick.json
 */

import type { Power } from '@/types';

export const ThunderKick: Power = {
  "name": "Thunder Kick",
  "internalName": "Thunder_Kick",
  "available": 0,
  "description": "You can perform a strong Thunder Kick that hits so hard it can Disorient your target.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Melee, Moderate DMG(Smash), Minor Disorient",
  "icon": "martialassault_thunderkick.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 7,
    "endurance": 7.696,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.48,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 6,
      "table": "Melee_Stun"
    }
  }
};
