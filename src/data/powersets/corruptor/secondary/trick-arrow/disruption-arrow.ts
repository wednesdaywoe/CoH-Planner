/**
 * Disruption Arrow
 * Ranged (Location AoE), -Res(All), -MaxEnd
 *
 * Source: corruptor_buff/trick_arrow/disruption_arrow.json
 */

import type { Power } from '@/types';

export const DisruptionArrow: Power = {
  "name": "Disruption Arrow",
  "internalName": "Disruption_Arrow",
  "available": 23,
  "description": "This arrow plants a sonic resonator at a target location. The vibrations of the resonator weaken the Damage Resistance and Max Endurance of all nearby foes.Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), -Res(All), -MaxEnd",
  "icon": "trickarrow_debuffdamres.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 30,
    "endurance": 14.56,
    "castTime": 1.16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Disruption Arrow",
      "powers": [
        "Redirects.Trick_Arrow.Disruption_Arrow",
        "Pets.ResistAll.ResistAll"
      ],
      "duration": 45
    }
  }
};
