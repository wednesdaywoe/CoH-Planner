/**
 * Sound Cannon
 * Ranged (Cone), Foe Disorient, Knockback
 *
 * Source: blaster_support/sonic_manipulation/sound_cannon.json
 */

import type { Power } from '@/types';

export const SoundCannon: Power = {
  "name": "Sound Cannon",
  "internalName": "Sound_Cannon",
  "available": 27,
  "description": "You generate a powerful sonic wave that will knock back and disorient foes in front of you for a short time.Recharge: Long.",
  "shortHelp": "Ranged (Cone), Foe Disorient, Knockback",
  "icon": "sonicmanipulation_soundcannon.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 0.8,
    "range": 45,
    "radius": 45,
    "arc": 1.5708,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Melee_Fear"
    },
    "knockback": {
      "scale": 0.65,
      "table": "Melee_Ones"
    }
  }
};
