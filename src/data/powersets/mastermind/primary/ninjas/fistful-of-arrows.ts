/**
 * Fistful of Arrows
 * Ranged (Cone), DMG(Lethal)
 *
 * Source: mastermind_summon/ninjas/fistful_of_arrows.json
 */

import type { Power } from '@/types';

export const FistfulofArrows: Power = {
  "name": "Fistful of Arrows",
  "internalName": "Fistful_of_Arrows",
  "available": 7,
  "description": "You fire a fistful of arrows at foes in a cone in front of you. Good at close range.Sensei's Guidance:Hitting with this power will grant your Ninja Henchman +3% Critical Hit chance for 30 seconds. This does not stack from the same power.",
  "shortHelp": "Ranged (Cone), DMG(Lethal)",
  "icon": "ninjas_fistfullarrows.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.155,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 10.66,
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
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.91,
    "table": "Ranged_Damage"
  }
};
