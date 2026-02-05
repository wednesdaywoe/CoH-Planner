/**
 * Synaptic Overload
 * Ranged Chain AoE, Foe Confuse, -End
 *
 * Source: dominator_control/electric_control/synaptic_overload.json
 */

import type { Power } from '@/types';

export const SynapticOverload: Power = {
  "name": "Synaptic Overload",
  "internalName": "Synaptic_Overload",
  "available": 21,
  "description": "This power can subtly scramble the synapses of any target affected, causing hallucinations and confusion amongst foes. The electric charge lasts for some time, and will jump slowly to other opponents causing wide spread confusion. Foes may not be aware that this has happened, and will not be alerted to your presence. You will also not receive experience for any damage dealt by confused opponents.Notes: This power has adaptive recharge. It has a base recharge of 6 seconds and each affected foe will increase the recharge by 6.5 seconds for a maximum total of 110 seconds.",
  "shortHelp": "Ranged Chain AoE, Foe Confuse, -End",
  "icon": "electriccontrol_synapticoverload.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 6,
    "endurance": 15.6,
    "castTime": 2,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Dominator Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
