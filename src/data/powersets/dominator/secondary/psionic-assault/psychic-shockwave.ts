/**
 * Psychic Shockwave
 * PBAoE, Light DMG(Psionic), Foe Disorient -Recharge
 *
 * Source: dominator_assault/psionic_assault/psychic_shockwave.json
 */

import type { Power } from '@/types';

export const PsychicShockwave: Power = {
  "name": "Psychic Shockwave",
  "internalName": "Psychic_Shockwave",
  "available": 29,
  "description": "Psychic Shockwave is a devastating Psionic attack that wracks the minds of all nearby foes. Affected foes may have a reduced attack rate and may be left Disoriented.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE, Light DMG(Psionic), Foe Disorient -Recharge",
  "icon": "psionicassault_psionicshockwave.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.97,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.0954,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Melee_Slow"
    }
  }
};
