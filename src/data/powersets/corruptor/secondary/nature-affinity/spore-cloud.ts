/**
 * Spore Cloud
 * Toggle (Targeted AoE), Foe -Dmg(All), -To Hit, -Regen
 *
 * Source: corruptor_buff/nature_affinity/spore_cloud.json
 */

import type { Power } from '@/types';

export const SporeCloud: Power = {
  "name": "Spore Cloud",
  "internalName": "Spore_Cloud",
  "available": 9,
  "description": "You create a large cloud of toxic spores around your targeted foe. The target and all nearby foes will have their damage output, chance to hit and regeneration rate reduced.Recharge: Moderate.",
  "shortHelp": "Toggle (Targeted AoE), Foe -Dmg(All), -To Hit, -Regen",
  "icon": "natureaffinity_sporecloud.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 3.1,
    "maxTargets": 16
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
    "tohitDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "damageDebuff": {
      "scale": 2.25,
      "table": "Ranged_Debuff_Dam"
    },
    "regenDebuff": {
      "scale": 1.5,
      "table": "Ranged_Ones"
    }
  }
};
