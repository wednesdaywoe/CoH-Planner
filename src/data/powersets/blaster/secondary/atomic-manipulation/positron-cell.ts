/**
 * Positron Cell
 * Ranged, DoT(Energy), Foe Hold, -DEF, +Positrons
 *
 * Source: blaster_support/radiation_manipulation/positron_cell.json
 */

import type { Power } from '@/types';

export const PositronCell: Power = {
  "name": "Positron Cell",
  "internalName": "Positron_Cell",
  "available": 3,
  "description": "Encases a single target in a cage made of positrons. The radiation emitted slowly hurts the victim, inflicting energy damage over time. The encased victim is held helpless and unable to defend themselves in addition to being surrounded by positively charged particles. Hitting a foe that has negatively charged particles will trigger a Gamma Burst.",
  "shortHelp": "Ranged, DoT(Energy), Foe Hold, -DEF, +Positrons",
  "icon": "atomicmanipulation_hold.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
