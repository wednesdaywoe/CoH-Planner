/**
 * Energy Absorption
 * PBAoE, Self +End, +DEF(All), Res (Slow), Foe -End
 *
 * Source: scrapper_defense/ice_armor/energy_absorption.json
 */

import type { Power } from '@/types';

export const EnergyAbsorption: Power = {
  "name": "Energy Absorption",
  "internalName": "Energy_Absorption",
  "available": 19,
  "description": "Activating this power draws moisture directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw moisture from adds to your own Endurance as well as Defense to all attacks. The first foe you absorb grants the highest Defense bonus, and you can absorb up to 10 foes. In addition to Defense, Energy Absorption also grants you resistance to Slow effects. If there are no foes within range, this power will fail.",
  "shortHelp": "PBAoE, Self +End, +DEF(All), Res (Slow), Foe -End",
  "icon": "icearmor_energyabsorption.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 60,
    "endurance": 13,
    "castTime": 1.33,
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
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 15,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.35,
      "table": "Melee_Ones"
    }
  }
};
