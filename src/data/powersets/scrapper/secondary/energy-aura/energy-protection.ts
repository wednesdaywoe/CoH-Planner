/**
 * Energy Protection
 * Auto: Self +Res (Energy, Negative, Toxic, Psionic, Slow)
 *
 * Source: scrapper_defense/energy_aura/energy_protection.json
 */

import type { Power } from '@/types';

export const EnergyProtection: Power = {
  "name": "Energy Protection",
  "internalName": "Energy_Protection",
  "available": 15,
  "description": "Your ability to channel energy makes you naturally resistant to Energy, Negative Energy, Psionic and Toxic damage. Additionally, this power grants some resistance to both recharge and movement slowing effects. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Energy, Negative, Toxic, Psionic, Slow)",
  "icon": "energyaura_protection.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "activatePeriod": 10
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "energy": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      }
    },
    "durations": {
      "resistance": 10.25,
      "debuffResistance": 10.25
    },
    "debuffResistance": {
      "movement": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "recharge": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 10.25
  }
};
