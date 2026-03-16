/**
 * Zapp
 * Sniper, DMG(Energy), Foe -End
 *
 * Source: corruptor_ranged/electrical_blast/zapp.json
 */

import type { Power } from '@/types';

export const Zapp: Power = {
  "name": "Zapp",
  "internalName": "Zapp",
  "available": 11,
  "description": "A focused electrical blast that can travel great distances with high Accuracy. Zapp drains Endurance, and is best fired from a distance, as it can be interrupted. Some of the Endurance you drain may transfer back to you. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Energy), Foe -End",
  "icon": "electricalbolt_zapp.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 3.33
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 4.5,
    "table": "Ranged_Damage"
  },
  "quickSnipe": {
    "stats": {
      "castTime": 1.33,
      "range": 80
    },
    "damage": {
      "type": "Energy",
      "scale": 2.28,
      "table": "Ranged_Damage"
    }
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.3,
      "table": "Ranged_EndDrain"
    }
  }
};
