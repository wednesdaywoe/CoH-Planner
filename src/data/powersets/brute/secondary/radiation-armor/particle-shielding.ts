/**
 * Particle Shielding
 * Self, +Absorb, +Regeneration
 *
 * Source: brute_defense/radiation_armor/particle_shielding.json
 */

import type { Power } from '@/types';

export const ParticleShielding: Power = {
  "name": "Particle Shielding",
  "internalName": "Particle_Shielding",
  "available": 23,
  "description": "You channel a tremendous amount of radiation into a barrier around you. For a short time you will have a strong absorption shield in addition to a regeneration and recovery buff.Recharge: Long.",
  "shortHelp": "Self, +Absorb, +Regeneration",
  "icon": "radiationarmor_particleshielding.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 120,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    }
  }
};
