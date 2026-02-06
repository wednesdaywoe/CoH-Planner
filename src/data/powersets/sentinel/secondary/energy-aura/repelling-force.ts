/**
 * Repelling Force
 * Auto: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative, Psionic, Toxic)
 *
 * Source: sentinel_defense/energy_aura/repelling_force.json
 */

import type { Power } from '@/types';

export const RepellingForce: Power = {
  "name": "Repelling Force",
  "internalName": "Repelling_Force",
  "available": 23,
  "description": "Your innate power over energies manifest itself naturally as a repelling force, increasing your defense against all types. This power is always on and costs no endurance.",
  "shortHelp": "Auto: Self +DEF(Smash, Lethal, Fire, Cold, Energy, Negative, Psionic, Toxic)",
  "icon": "energyaura_repellingforce.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "fire": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "cold": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "negative": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "psionic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "toxic": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
