/**
 * Fate Sealed
 * Auto: Self +Str(Mez), +Res(Mez), +Special
 *
 * Source: teamwork/fortunata_teamwork/fate_sealed.json
 */

import type { Power } from '@/types';

export const FateSealed: Power = {
  "name": "Fate Sealed",
  "available": 0,
  "description": "Fortunatas who possess Fate Sealed gain resistance to all control effects, empowers their own control attacks, and guarantees their psychic power's secondary effects. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Str(Mez), +Res(Mez), +Special",
  "icon": "fortunatateamwork_fatesealed.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self",
  "effects": {
    "specialBuff": {
      "hold": { "scale": 0.33, "table": "Melee_Ones" },
      "stun": { "scale": 0.33, "table": "Melee_Ones" },
      "immobilize": { "scale": 0.33, "table": "Melee_Ones" },
      "sleep": { "scale": 0.33, "table": "Melee_Ones" },
      "confuse": { "scale": 0.33, "table": "Melee_Ones" },
      "fear": { "scale": 0.33, "table": "Melee_Ones" }
    },
    "effectDuration": 0.75,
    "durations": {
      "confuse": 0.75,
      "fear": 0.75,
      "hold": 0.75,
      "immobilize": 0.75,
      "sleep": 0.75,
      "stun": 0.75
    }
  }
};
