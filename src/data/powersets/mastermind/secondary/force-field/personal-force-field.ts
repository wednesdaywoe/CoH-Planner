/**
 * Personal Force Field
 * Toggle: Self +Def, Res(All except Toxic)
 *
 * Source: mastermind_buff/force_field/personal_force_field.json
 */

import type { Power } from '@/types';

export const PersonalForceField: Power = {
  "name": "Personal Force Field",
  "internalName": "Personal_Force_Field",
  "available": 15,
  "description": "The Personal Force Field is almost impenetrable to all attacks, even Psionics and Enemy Teleportation, although attacks from more powerful foes may get through more easily. Personal Force Field will also reduce the damage of almost any attacks that do get through. The Personal Force Field works both ways; while it is active, you can only use powers that affect yourself. Cannot be used with Rest.",
  "shortHelp": "Toggle: Self +Def, Res(All except Toxic)",
  "icon": "forcefield_personalforcefield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 120,
    "endurance": 0.1625,
    "castTime": 2.03,
    "activatePeriod": 0.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6
};
