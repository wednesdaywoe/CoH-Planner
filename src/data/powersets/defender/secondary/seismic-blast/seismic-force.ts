/**
 * Seismic Force
 * Self +To Hit, +DMG, +Special
 *
 * Source: defender_ranged/seismic_blast/seismic_force.json
 */

import type { Power } from '@/types';

export const SeismicForce: Power = {
  "name": "Seismic Force",
  "internalName": "Seismic_Force",
  "available": 15,
  "description": "Greatly increases your attacks' chance to hit for a few seconds. Slightly increases damage.If affected by Seismic Shockwaves, this power will halt the shockwaves and will decrease the cooldown of all recharging Seismic Blast attacks by a moderate amount.",
  "shortHelp": "Self +To Hit, +DMG, +Special",
  "icon": "seismicblast_aim.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 5,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
