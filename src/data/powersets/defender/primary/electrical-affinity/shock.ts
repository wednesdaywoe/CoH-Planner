/**
 * Shock
 * Ranged, Foe -DMG, -End, -Recovery, -Regen
 *
 * Source: defender_buff/shock_therapy/shock.json
 */

import type { Power } from '@/types';

export const Shock: Power = {
  "name": "Shock",
  "internalName": "Shock",
  "available": 0,
  "description": "Strike a single foe with a highly-charged electrical shock, draining some endurance and moderately reducing their recovery, regeneration and damage output.Recharge: Slow.",
  "shortHelp": "Ranged, Foe -DMG, -End, -Recovery, -Regen",
  "icon": "shocktherapy_shock.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 12,
    "endurance": 8.528,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Dam"
    },
    "regenDebuff": {
      "scale": 0.75,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 0.75,
      "table": "Ranged_Ones"
    },
    "enduranceDrain": {
      "scale": 0.16,
      "table": "Ranged_EndDrain"
    }
  }
};
