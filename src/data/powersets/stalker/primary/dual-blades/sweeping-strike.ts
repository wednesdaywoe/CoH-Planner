/**
 * Sweeping Strike
 * Melee (Cone), DMG(Lethal)
 *
 * Source: stalker_melee/dual_blades/special_2.json
 */

import type { Power } from '@/types';

export const SweepingStrike: Power = {
  "name": "Sweeping Strike",
  "internalName": "Special_2",
  "available": 21,
  "description": "You make a sweeping strike with your blades, hitting all foes in a cone in front of you and dealing moderate lethal damage to each. This power is the opening move for the Weaken combination attack.Weaken: Sweeping Strike > Power Slice > One Thousand Cuts.",
  "shortHelp": "Melee (Cone), DMG(Lethal)",
  "icon": "dualblades_special2.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.23,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.7,
    "table": "Melee_Damage"
  }
};
