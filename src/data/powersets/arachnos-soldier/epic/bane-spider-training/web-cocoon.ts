/**
 * Web Cocoon
 * Ranged, Foe Hold, -Recharge, -Fly, -Jump, Slow
 *
 * Source: arachnos-soldier/bane-spider-training
 */

import type { Power } from '@/types';

export const WebCocoon: Power = {
  "name": "Web Cocoon",
  "available": 27,
  "description": "The Bane Mace can fire a more powerful version the common web grenade. The sinewy fibers of this grenade are strong enough to completely Hold one target. Targets able to resist the Hold are still likely to have their attack and movement speed dramatically slowed. Web Cocoon can also bring down flying targets and prevent foes from jumping.",
  "shortHelp": "Ranged, Foe Hold, -Recharge, -Fly, -Jump, Slow",
  "icon": "banespidertraining_webcocoon.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Slow Movement"
  ],
  "stats": {
    "accuracy": 1.05,
    "range": 60,
    "recharge": 16,
    "endurance": 10.66,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
