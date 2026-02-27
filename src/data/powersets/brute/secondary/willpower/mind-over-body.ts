/**
 * Mind Over Body
 * Toggle: Self +Res(Smash, Lethal, Psionics)
 *
 * Source: brute_defense/willpower/mind_over_body.json
 */

import type { Power } from '@/types';

export const MindOverBody: Power = {
  "name": "Mind Over Body",
  "internalName": "Mind_Over_Body",
  "available": 0,
  "description": "When you toggle on this power, you empower your Mind Over Body to become highly resistant to Smashing, Lethal and Psionic damage.Recharge: Very Fast.",
  "shortHelp": "Toggle: Self +Res(Smash, Lethal, Psionics)",
  "icon": "willpower_mindoverbody.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.104,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 2.25,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 2.25,
        "table": "Melee_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
