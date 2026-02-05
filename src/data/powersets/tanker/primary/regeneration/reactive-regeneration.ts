/**
 * Reactive Regeneration
 * Toggle: Self +Regeneration, +Res(-Regeneration, -End, -Recovery)
 *
 * Source: tanker_defense/regeneration/instant_healing.json
 */

import type { Power } from '@/types';

export const ReactiveRegeneration: Power = {
  "name": "Reactive Regeneration",
  "internalName": "Instant_Healing",
  "available": 17,
  "description": "When you activate this power, you can regenerate your health at an astounding rate. This boost becomes stronger every time you take damage, as it scales you also become resistant to regeneration and recovery debuffs as well as endurance drain.",
  "shortHelp": "Toggle: Self +Regeneration, +Res(-Regeneration, -End, -Recovery)",
  "icon": "regeneration_instanthealing.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.52,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6
};
