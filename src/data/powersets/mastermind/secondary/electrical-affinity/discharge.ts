/**
 * Discharge
 * Ranged (Targeted AoE), Foe -DMG, -End, -Recovery, -Regen
 *
 * Source: mastermind_buff/shock_therapy/discharge.json
 */

import type { Power } from '@/types';

export const Discharge: Power = {
  "name": "Discharge",
  "internalName": "Discharge",
  "available": 3,
  "description": "Unleash a blast of electrical energy around your target, draining them and all nearby enemies of some endurance. This will also reduce their regeneration, recovery, and damage dealt for a short period of time.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Foe -DMG, -End, -Recovery, -Regen",
  "icon": "shocktherapy_discharge.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 20,
    "endurance": 19.5,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_Dam"
    },
    "regenDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "enduranceDrain": {
      "scale": 0.25,
      "table": "Ranged_EndDrain"
    }
  }
};
