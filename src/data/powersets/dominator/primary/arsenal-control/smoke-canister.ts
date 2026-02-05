/**
 * Smoke Canister
 * Ranged (Location AoE), Foe -Perception, -To Hit, Confuse
 *
 * Source: dominator_control/arsenal_control/smoke_grenade.json
 */

import type { Power } from '@/types';

export const SmokeCanister: Power = {
  "name": "Smoke Canister",
  "internalName": "Smoke_Grenade",
  "available": 11,
  "description": "The Smoke Canister is a powerful infiltration tool. Fling it at a target location and it will quickly cover the area in smoke. While engulfed within this smoke, most enemies will not be able to see past normal melee range, although some may have better perception. If the foes are attacked, they will become confused and might attack their allies.",
  "shortHelp": "Ranged (Location AoE), Foe -Perception, -To Hit, Confuse",
  "icon": "arsenalcontrol_smokegrenade.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 90,
    "endurance": 16.64,
    "castTime": 1.4
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Confuse",
    "Dominator Archetype Sets",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Smoke Grenade",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Redirects.Assault_Rifle.Smoke_Grenade",
        "Redirects.Assault_Rifle.Smoke_Confusion"
      ],
      "duration": 30
    }
  }
};
