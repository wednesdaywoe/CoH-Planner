/**
 * Psychic Scream
 * Ranged (Cone), Light DMG(Psionic), Foe -Recharge
 *
 * Source: blaster_support/mental_manipulation/psychic_scream.json
 */

import type { Power } from '@/types';

export const PsychicScream: Power = {
  "name": "Psychic Scream",
  "internalName": "Psychic_Scream",
  "available": 9,
  "description": "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Psionic), Foe -Recharge",
  "icon": "psionicassault_psychicscream.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 0.5236,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.04,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "damageBuff": {
      "scale": 0.064,
      "table": "Ranged_Ones"
    }
  }
};
