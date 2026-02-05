/**
 * Combat Flight
 * Toggle: Self Fly, +DEF
 *
 * Source: peacebringer/luminous-aura
 */

import type { Power } from '@/types';

export const CombatFlight: Power = {
  "name": "Combat Flight",
  "available": 9,
  "description": "For hovering and aerial combat. This power is much slower than Energy Flight, but provides some Defense, offers good air control, costs little Endurance, and has none of the penalties associated with Energy Flight. Switch to this mode when fighting other flying foes.  Combat Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
  "shortHelp": "Toggle: Self Fly, +DEF",
  "icon": "luminousaura_combatflight.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Fly",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Flight",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "endurance": 0.2,
    "castTime": 0.5
  },
  "targetType": "Self"
};
