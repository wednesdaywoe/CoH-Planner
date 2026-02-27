/**
 * EMP Arrow
 * AoE, Foe Hold, -Boost, Special vs. Robots
 *
 * Source: defender_buff/trick_arrow/emp_arrow.json
 */

import type { Power } from '@/types';

export const EMPArrow: Power = {
  "name": "EMP Arrow",
  "internalName": "EMP_Arrow",
  "available": 25,
  "description": "EMP Arrow unleashes a massive pulse of electromagnetic energy on impact. Allies that enter the field will see an increase to their damage resistances against all damage except Toxic. They are also protected from status effects, knockbacks, endurance drain, recovery debuffs and recharge debuffs. Only one EMP Field can be sustained at once. This EMP will affect enemy machines adversively, and is even powerful enough to affect synaptic brain patterns. It will incapacitate all foes in its radius. Machines and robots are more likely to take high damage.Recharge: Very Long.",
  "shortHelp": "AoE, Foe Hold, -Boost, Special vs. Robots",
  "icon": "trickarrow_stun.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 35,
    "recharge": 300,
    "endurance": 23.4,
    "castTime": 1.83,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "EMP Field",
      "powers": [
        "Redirects.Trick_Arrow.EMP_Arrow",
        "Redirects.Trick_Arrow.EMP_Arrow_Fx"
      ],
      "duration": 240
    }
  }
};
