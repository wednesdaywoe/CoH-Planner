/**
 * Mesmerize
 * Ranged, DMG(Psionic), Foe Deep Sleep
 *
 * Source: controller_control/mind_control/mesmerize.json
 */

import type { Power } from '@/types';

export const Mesmerize: Power = {
  "name": "Mesmerize",
  "internalName": "Mesmerize",
  "available": 0,
  "description": "Mesmerize painfully assails a target with psychic energy, rendering them unconscious. The target will remain asleep for some time, but will awaken if attacked.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Deep Sleep",
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
    "Controller Archetype Sets",
    "Ranged Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
