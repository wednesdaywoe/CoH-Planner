/**
 * White Dwarf Sublimation
 * Self Heal
 *
 * Source: peacebringer_defensive/luminous_aura/white_dwarf_sublimation.json
 */

import type { Power } from '@/types';

export const WhiteDwarfSublimation: Power = {
  "name": "White Dwarf Sublimation",
  "available": 19,
  "description": "Through perfect control of your body and energy, you can concentrate for a few moments and heal yourself. This power is only available while in White Dwarf Form.  Recharge: Slow.",
  "shortHelp": "Self Heal",
  "icon": "luminousaura_reformessence.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "targetType": "Self",
  "requires": "White Dwarf",
  "damage": {
    "type": "Heal",
    "scale": 4.375,
    "table": "Melee_HealSelf"
  }
};
