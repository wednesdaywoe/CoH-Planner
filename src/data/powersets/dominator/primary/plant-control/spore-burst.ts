/**
 * Spore Burst
 * Ranged (Targeted AoE), Foe Deep Sleep
 *
 * Source: dominator_control/plant_control/spore_burst.json
 */

import type { Power } from '@/types';

export const SporeBurst: Power = {
  "name": "Spore Burst",
  "internalName": "Spore_Burst",
  "available": 5,
  "description": "You hurl a large fungi pod at your foes. This pod is full of Spores that burst on impact, engulfing the target and all those around him. All affected targets may succumb to the narcotic effect of the Spores and will fall asleep. The targets will remain asleep for some time, but will awaken if attacked.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged (Targeted AoE), Foe Deep Sleep",
  "icon": "plantcontrol_sporeburst.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 25,
    "recharge": 45,
    "endurance": 13,
    "castTime": 1.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Sleep"
  ],
  "maxSlots": 6,
  "effects": {
    "sleep": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Sleep"
    }
  }
};
