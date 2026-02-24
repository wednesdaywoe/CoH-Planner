/**
 * Repulsion Field
 * Toggle: PBAoE Knockback
 *
 * Source: defender_buff/force_field/repulsion_field.json
 */

import type { Power } from '@/types';

export const RepulsionField: Power = {
  "name": "Repulsion Field",
  "internalName": "Repulsion_Field",
  "available": 17,
  "description": "This Toggle power creates a field that keeps all foes at bay, protecting all allies inside from melee or short ranged attacks. More powerful foes may be able to penetrate the Repulsion Field, but may slip and get knocked down and forced back if they try.Enemies that get too close will be violently knocked away. In PvP, Each villain that is knocked away costs you additional Endurance.Note: Slotting Knockback to Knockdown enhancement in this power will disable Repel.",
  "shortHelp": "Toggle: PBAoE Knockback",
  "icon": "forcefield_repulsionfield.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 20,
    "endurance": 0.1625,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Knockback"
  ],
  "maxSlots": 6,
  "effects": {
    "knockback": {
      "scale": 3,
      "table": "Ranged_Knockback"
    },
    "repel": {
      "scale": 10,
      "table": "Ranged_Ones"
    }
  }
};
