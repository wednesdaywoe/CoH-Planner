/**
 * Kinetic Shield
 * Toggle: Self +DEF(Smashing, Lethal, Energy), Res(DeBuff DEF)
 *
 * Source: brute_defense/energy_aura/kinetic_shield.json
 */

import type { Power } from '@/types';

export const KineticShield: Power = {
  "name": "Kinetic Shield",
  "internalName": "Kinetic_Shield",
  "available": 0,
  "description": "Kinetic Shield creates a harmonic Energy Aura that can deflect physical attacks. Your Defense to Smashing and Lethal attacks is increased as weapons and powers like bullets, blades and punches tend to deflect off the shield. Kinetic Shield also grants you good resistance to Defense Debuffs. The Energy based nature of Kinetic Shield also offers some minimal Defense to Energy attacks. Kinetic Shield also adds an Elusivity defense bonus to Smashing, Lethal, and Energy Attacks in PVP zones.",
  "shortHelp": "Toggle: Self +DEF(Smashing, Lethal, Energy), Res(DeBuff DEF)",
  "icon": "energyaura_kineticshield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "smashing": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 1.7,
        "table": "Melee_Buff_Def"
      },
      "energy": {
        "scale": 0.25,
        "table": "Melee_Buff_Def"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
