/**
 * Starless Step
 * Ranged (Location), Self Teleport, ToHit
 *
 * Source: warshade_offensive/umbral_blast/starless_step.json
 */

import type { Power } from '@/types';

export const StarlessStep: Power = {
  "name": "Starless Step",
  "available": 7,
  "description": "You can Teleport moderate distances extremely quickly. These quick teleports surprise foes, giving your next attack a small ToHit advantage. This power can be used up to 3 times in a row before it starts recharging. Note that Starless is unaffected by Range changes.  Notes: Starless Step is unaffected by Range changes.  Recharge: Fast.",
  "shortHelp": "Ranged (Location), Self Teleport, ToHit",
  "icon": "umbralblast_starlessstep.png",
  "powerType": "Click",
  "effectArea": "Location",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "Teleport",
    "To Hit Buff",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 6,
    "endurance": 5.5714,
    "castTime": 0.67
  },
  "targetType": "Location (Teleport)",
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    }
  }
};
