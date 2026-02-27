/**
 * Shadow Recall
 * Teleport Teamate or Foe
 *
 * Source: warshade_defensive/umbral_aura/shadow_recall.json
 */

import type { Power } from '@/types';

export const ShadowRecall: Power = {
  "name": "Shadow Recall",
  "available": 9,
  "description": "You can Teleport a single foe or ally directly next to yourself. A successful hit must be made in order to Teleport the foes. Some powerful foes cannot be Teleported. Enemy players that are teleported will be temporarily out of phase, and cannot be targeted or damaged. This power can be interrupted while teleporting foes.  Recharge: Fast.",
  "shortHelp": "Teleport Teamate or Foe",
  "icon": "umbralaura_shadowrecall.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Teleport",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "range": 10000,
    "recharge": 6,
    "endurance": 15,
    "castTime": 5.93
  },
  "targetType": "Any (Alive)"
};
