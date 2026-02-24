/**
 * Energy Drain
 * PBAoE, Self +End, +Def, Foe -End
 *
 * Source: stalker_defense/energy_aura/energy_drain.json
 */

import type { Power } from '@/types';

export const EnergyDrain: Power = {
  "name": "Energy Drain",
  "internalName": "Energy_Drain",
  "available": 23,
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
    "EnduranceReduction",
    "Recharge"
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
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
