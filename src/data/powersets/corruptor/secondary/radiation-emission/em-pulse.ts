/**
 * EM Pulse
 * PBAoE, Foe Hold, -END, -Regen, Special vs. Robots; Self -Recovery
 *
 * Source: corruptor_buff/radiation_emission/em_pulse.json
 */

import type { Power } from '@/types';

export const EMPulse: Power = {
  "name": "EM Pulse",
  "internalName": "EM_Pulse",
  "available": 29,
  "description": "You can unleash a massive pulse of electromagnetic energy. This EMP can affect machines, and is even powerful enough to affect synaptic brain patterns. It will drain the Endurance, and HP Regeneration of all affected targets and leave them incapacitate and Held for a long while. Additionally, most machines and robots will take moderate high damage. However, this power uses a lot of Endurance and leaves you unable to recover Endurance for a while.Damage: Moderate.Recharge: Very Long.",
  "shortHelp": "PBAoE, Foe Hold, -END, -Regen, Special vs. Robots; Self -Recovery",
  "icon": "radiationpoisoning_emppulse.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 60,
    "recharge": 300,
    "endurance": 20.8,
    "castTime": 2.93,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Holds"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.45,
      "table": "Ranged_EndDrain"
    },
    "regenDebuff": {
      "scale": 10,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 10,
      "table": "Ranged_Ones"
    }
  }
};
