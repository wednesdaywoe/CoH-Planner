/**
 * Shadow Slip
 * Melee (PBAoE), Foe Teleport
 *
 * Source: warshade_defensive/umbral_aura/shadow_slip.json
 */

import type { Power } from '@/types';

export const ShadowSlip: Power = {
  "name": "Shadow Slip",
  "available": 25,
  "description": "Shadow Slip teleports enemies from up to 100ft away into melee range of the caster.  Recharge: Long.",
  "shortHelp": "Melee (PBAoE), Foe Teleport",
  "icon": "umbralaura_shadowslip.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [],
  "stats": {
    "accuracy": 1,
    "recharge": 120,
    "endurance": 10.5161,
    "castTime": 1.67,
    "radius": 100,
    "maxTargets": 16
  },
  "targetType": "Self"
};
