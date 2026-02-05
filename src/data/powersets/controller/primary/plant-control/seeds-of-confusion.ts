/**
 * Seeds of Confusion
 * Ranged (Cone), Foe Confuse
 *
 * Source: controller_control/plant_control/seeds_of_confusion.json
 */

import type { Power } from '@/types';

export const SeedsofConfusion: Power = {
  "name": "Seeds of Confusion",
  "internalName": "Seeds_of_Confusion",
  "available": 7,
  "description": "You throw a handful of seeds from a rare Baffle plant at your foes. The seeds spread out in a wide cone and release a dusty chaff that contain a number of alkaloids and hallucinogenic compounds. Foes that come into contact with these seeds become violently confused and will turn and attack each other, ignoring you and all your allies. You will not receive any Experience Points for foes defeated entirely by Confused enemies.Notes: This power has adaptive recharge. It has a base recharge of 6 seconds and each affected foe will increase the recharge by 6.5 seconds for a maximum total of 110 seconds.",
  "shortHelp": "Ranged (Cone), Foe Confuse",
  "icon": "plantcontrol_seedsconfusion.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 1.0472,
    "recharge": 6,
    "endurance": 15.6,
    "castTime": 1.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Controller Archetype Sets"
  ],
  "maxSlots": 6
};
