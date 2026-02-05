/**
 * Spinning Kick
 * Melee Cone, Light DMG(Smash), Knockdown
 *
 * Source: dominator_assault/martial_assault/spinning_kick.json
 */

import type { Power } from '@/types';

export const SpinningKick: Power = {
  "name": "Spinning Kick",
  "internalName": "Spinning_Kick",
  "available": 9,
  "description": "You perform a high spinning reverse roundhouse kick, smashing anything in front of you with devastating force. You can activate this ability at any time, no matter what you have targeted; it will strike enemies directly in front of your character, rather than enemies near your target.Damage: Light.Recharge: Moderate.",
  "shortHelp": "Melee Cone, Light DMG(Smash), Knockdown",
  "icon": "martialassault_spinningkick.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 9,
    "radius": 9,
    "arc": 1.5708,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.07,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.3434,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.66,
      "table": "Melee_Ones"
    }
  }
};
