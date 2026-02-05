/**
 * Pistols
 * Ranged, Light DMG(Lethal)
 *
 * Source: mastermind_summon/thugs/pistols.json
 */

import type { Power } from '@/types';

export const Pistols: Power = {
  "name": "Pistols",
  "internalName": "Pistols",
  "available": 0,
  "description": "Quickly fires a round from one of your heavy automatic pistols. Damage is average, but the fire rate is very fast.Damage: Light.Recharge: Very Fast.",
  "shortHelp": "Ranged, Light DMG(Lethal)",
  "icon": "thugs_targetedrangedminordmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 3,
    "endurance": 6.5,
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
