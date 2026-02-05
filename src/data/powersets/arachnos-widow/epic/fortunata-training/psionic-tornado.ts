/**
 * Psionic Tornado
 * Ranged (Targeted AoE), DoT(Psionic), Foe Knockback
 *
 * Source: arachnos-widow/fortunata-training
 */

import type { Power } from '@/types';

export const PsionicTornado: Power = {
  "name": "Psionic Tornado",
  "available": 11,
  "description": "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed.",
  "shortHelp": "Ranged (Targeted AoE), DoT(Psionic), Foe Knockback",
  "icon": "fortunatatraining_psionictornado.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 20,
    "endurance": 21.154,
    "castTime": 2.37,
    "radius": 20,
    "maxTargets": 12
  },
  "targetType": "Foe (Alive)"
};
