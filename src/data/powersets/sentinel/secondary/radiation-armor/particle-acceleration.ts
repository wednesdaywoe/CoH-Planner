/**
 * Particle Acceleration
 * Auto: Self +Recharge, +SPD, Res (Slow)
 *
 * Source: sentinel_defense/radiation_armor/particle_acceleration.json
 */

import type { Power } from '@/types';

export const ParticleAcceleration: Power = {
  "name": "Particle Acceleration",
  "internalName": "Particle_Acceleration",
  "available": 19,
  "description": "Your Particles have been accelerated allowing you to move faster than normal, as well as resist slow effects. This power is always on and permanently increases your attack rate and movement speed.",
  "shortHelp": "Auto: Self +Recharge, +SPD, Res (Slow)",
  "icon": "radiationarmor_particleacceleration.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "effects": {
    "rechargeBuff": {
      "scale": 0.4,
      "table": "Melee_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Melee_SpeedFlying"
      }
    }
  }
};
