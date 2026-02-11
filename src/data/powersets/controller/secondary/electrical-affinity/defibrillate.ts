/**
 * Defibrillate
 * Melee (Targeted AoE), Ally Rez, Foe Sleep, -End, -Recovery
 *
 * Source: controller_buff/shock_therapy/defibrillate.json
 */

import type { Power } from '@/types';

export const Defibrillate: Power = {
  "name": "Defibrillate",
  "internalName": "Defibrillate",
  "available": 23,
  "description": "Strike a target with a highly-charged jolt of electricity, reviving all nearby allies and draining all nearby foes. Any enemies affected will be drained of some endurance, have their recovery reduced and be put to sleep for a short time. Defibrillate consumes all stacks of Static, and the strength of the offensive component of this power scales with the number of stacks consumed. Allies will always be revived with full health and endurance regardless of the number of Static stacks consumed.Recharge: Long.",
  "shortHelp": "Melee (Targeted AoE), Ally Rez, Foe Sleep, -End, -Recovery",
  "icon": "shocktherapy_defibrillate.png",
  "powerType": "Click",
  "targetType": "Any",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 120,
    "endurance": 10.4,
    "castTime": 3.3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Sleep"
  ],
  "maxSlots": 6
};
