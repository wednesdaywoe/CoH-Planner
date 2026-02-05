/**
 * Dual Wield
 * Ranged, Light DMG(Lethal), Foe Knockback
 *
 * Source: mastermind_summon/thugs/dual_wield.json
 */

import type { Power } from '@/types';

export const DualWield: Power = {
  "name": "Dual Wield",
  "internalName": "Dual_Wield",
  "available": 1,
  "description": "Fires both pistols at once at a time target. Firing both pistols at once is slower than a single shot, but deals more damage, and the target may get knocked down by the force of the impact.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Lethal), Foe Knockback",
  "icon": "thugs_targetedrangedheavydmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 6,
    "endurance": 8.58,
    "castTime": 1.2
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.66,
    "table": "Ranged_Damage",
    "duration": 0.3,
    "tickRate": 0.25
  },
  "effects": {
    "knockback": {
      "scale": 0.64,
      "table": "Ranged_Knockback"
    }
  }
};
