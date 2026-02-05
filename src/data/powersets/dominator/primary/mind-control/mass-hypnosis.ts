/**
 * Mass Hypnosis
 * Ranged (Targeted AoE), Foe Deep Sleep
 *
 * Source: dominator_control/mind_control/mass_hypnosis.json
 */

import type { Power } from '@/types';

export const MassHypnosis: Power = {
  "name": "Mass Hypnosis",
  "internalName": "Mass_Hypnosis",
  "available": 7,
  "description": "Hypnotizes a group of foes at a distance and puts them to Sleep. The targets will remain asleep for some time, but will awaken if attacked. This power deals no damage, but if done discreetly, the targets will never be aware of your presence.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged (Targeted AoE), Foe Deep Sleep",
  "icon": "mentalcontrol_masshypnosis.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Sleep"
  ],
  "maxSlots": 6
};
