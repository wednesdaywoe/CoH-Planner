/**
 * Fistful of Arrows
 * Ranged (Cone), Light DMG(Lethal)
 *
 * Source: sentinel_ranged/archery/fistful_of_arrows.json
 */

import type { Power } from '@/types';

export const FistfulofArrows: Power = {
  "name": "Fistful of Arrows",
  "internalName": "Fistful_of_Arrows",
  "available": 1,
  "description": "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.Damage: Light.Recharge: Moderate.",
  "shortHelp": "Ranged (Cone), Light DMG(Lethal)",
  "icon": "archery_conearrow.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.155,
    "range": 40,
    "radius": 40,
    "arc": 0.8727,
    "recharge": 8,
    "endurance": 8.53,
    "castTime": 1.17,
    "maxTargets": 6
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.91,
    "table": "Ranged_Damage"
  }
};
