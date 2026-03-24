/**
 * Spore Cloud
 * Toggle: Ranged (Targeted AoE), Foe -DMG, -ToHit, -Regen
 *
 * Source: blaster_support/plant_manipulation/spore_cloud.json
 */

import type { Power } from '@/types';

export const SporeCloud: Power = {
  "name": "Spore Cloud",
  "internalName": "Spore_Cloud",
  "available": 15,
  "description": "You create a large cloud of toxic spores around your targeted foe. The target and all nearby foes will have their damage output, chance to hit and regeneration rate reduced.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG, -ToHit, -Regen",
  "icon": "natureaffinity_sporecloud.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 10,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 3.1,
    "activatePeriod": 0.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "regenDebuff": {
      "scale": 3.75,
      "table": "Ranged_Res_Boolean"
    },
    "durations": {
      "regenDebuff": 0.75
    },
    "buffDuration": 0.75
  }
};
