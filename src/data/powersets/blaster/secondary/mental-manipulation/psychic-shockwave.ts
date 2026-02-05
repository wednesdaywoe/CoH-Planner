/**
 * Psychic Shockwave
 * Close (AoE), Light DMG(Psionic), Foe Disorient -Recharge
 *
 * Source: blaster_support/mental_manipulation/psychic_shockwave.json
 */

import type { Power } from '@/types';

export const PsychicShockwave: Power = {
  "name": "Psychic Shockwave",
  "internalName": "Psychic_Shockwave",
  "available": 27,
  "description": "Psychic Shockwave is a devastating Psionic attack that wracks the minds of all nearby foes. Affected foes may have a reduced attack rate and may be left Disoriented.Damage: Light.Recharge: Slow.",
  "shortHelp": "Close (AoE), Light DMG(Psionic), Foe Disorient -Recharge",
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
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Ranged_Stun"
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "damageBuff": {
      "scale": 0.04,
      "table": "Ranged_Ones"
    }
  }
};
