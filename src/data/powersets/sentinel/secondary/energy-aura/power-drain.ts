/**
 * Power Drain
 * Autohit: PBAoE, Self +End, Foe -End, -Recovery
 *
 * Source: sentinel_defense/energy_aura/power_drain.json
 */

import type { Power } from '@/types';

export const PowerDrain: Power = {
  "name": "Power Drain",
  "internalName": "Power_Drain",
  "available": 27,
  "description": "Power Drain leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.Recharge: Long.",
  "shortHelp": "Autohit: PBAoE, Self +End, Foe -End, -Recovery",
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
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.33,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    }
  }
};
