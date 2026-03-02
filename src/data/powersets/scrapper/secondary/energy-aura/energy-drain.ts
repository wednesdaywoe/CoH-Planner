/**
 * Energy Drain
 * PBAoE, Self +End, +Def, Foe -End
 *
 * Source: scrapper_defense/energy_aura/energy_drain.json
 */

import type { Power } from '@/types';

export const EnergyDrain: Power = {
  "name": "Energy Drain",
  "internalName": "Energy_Drain",
  "available": 27,
  "description": "Energy Drain leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance and Defense. If there are no foes within range, you will not gain any Endurance or Defense.",
  "shortHelp": "PBAoE, Self +End, +Def, Foe -End",
  "icon": "energyaura_drain.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 60,
    "endurance": 13,
    "castTime": 2.37,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
      "enduranceDrain": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "enduranceGain": {
        "scale": 25,
        "table": "Melee_Ones",
        "perTarget": 25
      },
      "recoveryDebuff": {
        "scale": 1,
        "table": "Melee_Ones"
      },
      "defenseBuff": {
        "smashing": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "lethal": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "fire": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "cold": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "energy": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "negative": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "psionic": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        },
        "toxic": {
          "scale": 0.12,
          "table": "Melee_Buff_Def",
          "perTarget": 0.04
        }
      }
    }
};
