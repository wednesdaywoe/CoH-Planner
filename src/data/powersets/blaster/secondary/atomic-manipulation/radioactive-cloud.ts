/**
 * Radioactive Cloud
 * PBAoE, Foe Hold, Immobilize
 *
 * Source: blaster_support/radiation_manipulation/radioactive_cloud.json
 */

import type { Power } from '@/types';

export const RadioactiveCloud: Power = {
  "name": "Radioactive Cloud",
  "internalName": "Radioactive_Cloud",
  "available": 27,
  "description": "When activated, you generate toxic radioactive gas around yourself. Any nearby foes may be overcome by the gas, leaving them choking or barfing helplessly. Choking foes might temporarily snap out of it when hit, barfing foes are more likely to be too sick to counterattack.",
  "shortHelp": "PBAoE, Foe Hold, Immobilize",
  "icon": "atomicmanipulation_holdpbaoe.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 20,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds"
  ],
  "maxSlots": 6
};
