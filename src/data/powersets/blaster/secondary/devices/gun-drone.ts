/**
 * Gun Drone
 * Build Turret: Ranged, Moderate DMG(Lethal)
 *
 * Source: blaster_support/gadgets/auto_turret.json
 */

import type { Power } from '@/types';

export const GunDrone: Power = {
  "name": "Gun Drone",
  "internalName": "Auto_Turret",
  "available": 29,
  "description": "You can summon a Gun Drone. The Drone has an extremely fast fire rate and is equipped with a customized tracking system. Once locked on, the Drone will continue to unload a volley of lead into the target until it is destroyed. Enemies hit by the drone, as well as those near it, will prioritize attacking it over it's owner. The Drone is armored, but can be destroyed.Damage: Moderate.Recharge: Long.",
  "shortHelp": "Build Turret: Ranged, Moderate DMG(Lethal)",
  "icon": "gadgets_turret.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "recharge": 180,
    "endurance": 39,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Recharge Intensive Pets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Turret",
      "duration": 90
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
