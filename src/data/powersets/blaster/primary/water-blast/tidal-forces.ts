/**
 * Tidal Forces
 * Self +To Hit, +DMG
 *
 * Source: blaster_ranged/water_blast/tidal_forces.json
 */

import type { Power } from '@/types';

export const TidalForces: Power = {
  "name": "Tidal Forces",
  "internalName": "Tidal_Forces",
  "available": 7,
  "description": "You draw tidal energies into yourself thus boosting your chance to hit significantly, slightly boosting your damage and granting yourself +3 Tidal Power.",
  "shortHelp": "Self +To Hit, +DMG",
  "icon": "waterblast_tidalforces.png",
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
      "scale": 2.5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
