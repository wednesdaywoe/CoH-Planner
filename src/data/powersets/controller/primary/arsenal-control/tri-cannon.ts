/**
 * Tri-Cannon
 * Build Tri-Cannon: Ranged, DMG(Lethal)
 *
 * Source: controller_control/arsenal_control/gun_drone.json
 */

import type { Power } from '@/types';

export const TriCannon: Power = {
  "name": "Tri-Cannon",
  "internalName": "Gun_Drone",
  "available": 25,
  "description": "The Tri-Cannon is the perfect companion in the field. It has an extremely fast fire rate and is equipped with a customized tracking system. Once locked on, it will continue to unload a volley of lead into the target until it is destroyed. Enemies around the Tri-Cannon, as well as those hit by it, will prioritize attacking it over its owner. It is armored and can take significant amounts of damage.",
  "shortHelp": "Build Tri-Cannon: Ranged, DMG(Lethal)",
  "icon": "arsenalcontrol_gunturret.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "recharge": 240,
    "endurance": 26,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Pet Damage",
    "Recharge Intensive Pets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_GunDrone_Tri_Controller"
    }
  }
};
