/**
 * Fistful of Arrows
 * Ranged (Cone), DMG(Lethal)
 *
 * Source: blaster_ranged/archery/fistful_of_arrows.json
 */

import type { Power } from '@/types';

export const FistfulofArrows: Power = {
  "name": "Fistful of Arrows",
  "internalName": "Fistful_of_Arrows",
  "available": 1,
  "description": "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.",
  "shortHelp": "Ranged (Cone), DMG(Lethal)",
  "icon": "archery_conearrow.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.155,
    "range": 50,
    "radius": 50,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.91,
    "table": "Ranged_Damage"
  },
  "effects": {
    "damageBuff": {
      "scale": 0.032,
      "table": "Ranged_Ones"
    }
  }
};
