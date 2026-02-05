/**
 * Neurotoxic Breath
 * Ranged (Cone), Foe -SPD, -Recharge
 *
 * Source: controller_buff/poison/neurotoxic_breath.json
 */

import type { Power } from '@/types';

export const NeurotoxicBreath: Power = {
  "name": "Neurotoxic Breath",
  "internalName": "Neurotoxic_Breath",
  "available": 9,
  "description": "You can breath a cone of Neurotoxin gas that quickly start to anesthetize any nearby foes. Affected targets may choke on the gas as their movement and attack rate are severely reduced.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Foe -SPD, -Recharge",
  "icon": "poison_neurotoxicbreath.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 0.5236,
    "recharge": 30,
    "endurance": 10.4,
    "castTime": 2.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "rechargeDebuff": {
      "scale": 0.65,
      "table": "Ranged_Slow"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.65,
        "table": "Ranged_Slow"
      }
    },
    "hold": {
      "mag": 2,
      "scale": 3,
      "table": "Ranged_Immobilize"
    },
    "slow": {
      "runSpeed": {
        "scale": 1.5,
        "table": "Ranged_SpeedRunning"
      }
    }
  }
};
