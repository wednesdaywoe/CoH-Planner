/**
 * Empty Clips
 * Ranged (Cone), Minor DMG(Lethal), Knockback
 *
 * Source: mastermind_summon/thugs/empty_clips.json
 */

import type { Power } from '@/types';

export const EmptyClips: Power = {
  "name": "Empty Clips",
  "internalName": "Empty_Clips",
  "available": 7,
  "description": "You empty the clips of both your pistols in a arc of suppression fire. This attack can blast multiple foes in the affected cone area, and has a small chance of knocking some foes down.Damage: Minor.Recharge: Moderate.",
  "shortHelp": "Ranged (Cone), Minor DMG(Lethal), Knockback",
  "icon": "thugs_conerangedmoderatedmg.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.1,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 8,
    "endurance": 18.98,
    "castTime": 1.83,
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
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.2633,
    "table": "Ranged_Damage",
    "duration": 0.7,
    "tickRate": 0.3
  },
  "effects": {
    "knockback": {
      "scale": 0.64,
      "table": "Ranged_Knockback"
    }
  }
};
