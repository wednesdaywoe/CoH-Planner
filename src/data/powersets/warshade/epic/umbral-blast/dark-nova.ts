/**
 * Dark Nova
 * Toggle: Shapeshift, Special
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const DarkNova: Power = {
  "name": "Dark Nova",
  "available": 3,
  "description": "Kheldians are masters of energy and matter. A Warshade can transform into a flying energy beast known as a Dark Nova. When you choose this power, you will have access to 4 very powerful ranged attacks that can only be used while in this form. You will not be able to use any other powers while in Dark Nova form. Dark Nova can fly, has an increased chance to hit and improved Endurance Recovery but has no defense.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Shapeshift, Special",
  "icon": "umbralblast_darknova.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "EnduranceReduction",
    "Recharge",
    "Fly",
    "ToHit"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Flight",
    "To Hit Buff",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 1,
    "endurance": 0.13
  },
  "targetType": "Self"
};
