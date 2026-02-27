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
    "confuse": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "fear": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "effectDuration": 0.75
  }
};
