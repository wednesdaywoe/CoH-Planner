/**
 * Mesmerize
 * Ranged, Light DMG(Psionic), Foe Deep Sleep
 *
 * Source: dominator_control/mind_control/mesmerize.json
 */

import type { Power } from '@/types';

export const Mesmerize: Power = {
  "name": "Mesmerize",
  "internalName": "Mesmerize",
  "available": 0,
  "description": "Mesmerize painfully assails a target with psychic energy, rendering him unconscious. The target will remain asleep for some time, but will awaken if attacked.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.",
  "shortHelp": "Ranged, Light DMG(Psionic), Foe Deep Sleep",
  "icon": "mentalcontrol_hypnotize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 100,
    "recharge": 6,
    "endurance": 5.2,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
