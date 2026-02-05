/**
 * Seismic Shockwaves
 * Foe Knock Down, Self Special
 *
 * Source: blaster_ranged/seismic_blast/shockwaves.json
 */

import type { Power } from '@/types';

export const SeismicShockwaves: Power = {
  "name": "Seismic Shockwaves",
  "internalName": "Shockwaves",
  "available": 0,
  "description": "While on the ground, nearby enemies might be knocked down and some of your attacks are empowered.This power is only for short periods of times after being triggered by Seismic Pressure.",
  "shortHelp": "Foe Knock Down, Self Special",
  "icon": "seismic_power.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 15,
    "maxTargets": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
