/**
 * Nebulous Form
 * Toggle: Self Intangible, +Jump
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const NebulousForm: Power = {
  "name": "Nebulous Form",
  "available": 23,
  "description": "You can Phase Shift to become out of sync with normal space. Although you do not become completely Invisible, you are translucent and hard to see. You are intangible, and cannot affect or be affected by those in normal space. Even gravity has a weak hold on you. You can jump great distances while in Nebulous Form. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Cannot be used with Rest.  Nebulous Form can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.  Recharge: Slow.",
  "shortHelp": "Toggle: Self Intangible, +Jump",
  "icon": "umbralaura_nebulousform.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Jump"
  ],
  "allowedSetCategories": [
    "Leaping",
    "Leaping & Sprints",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 0.325
  },
  "targetType": "Self"
};
