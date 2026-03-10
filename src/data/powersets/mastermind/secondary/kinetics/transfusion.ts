/**
 * Transfusion
 * Ranged, Foe -End, -Regen, Team Heal
 *
 * Source: mastermind_buff/kinetics/transfusion.json
 */

import type { Power } from '@/types';

export const Transfusion: Power = {
  "name": "Transfusion",
  "internalName": "Transfusion",
  "available": 0,
  "description": "Transfusion drains an enemy of some Endurance and reduces the target's Regeneration rate, and transfers that energy, in the form of Hit Points, to all allies near the affected foe. You can use Transfusion to heal yourself as well as your allies.Recharge: Moderate.",
  "shortHelp": "Ranged, Foe -End, -Regen, Team Heal",
  "icon": "kineticboost_transfusion.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 8,
    "endurance": 9.75,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_EndDrain"
    },
    "regenDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
