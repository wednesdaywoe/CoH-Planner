/**
 * Psychic Scream
 * Ranged (Cone), Light DMG(Psionic), Foe -Recharge
 *
 * Source: dominator_assault/psionic_assault/psychic_scream.json
 */

import type { Power } from '@/types';

export const PsychicScream: Power = {
  "name": "Psychic Scream",
  "internalName": "Psychic_Scream",
  "available": 15,
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
    "recharge": 16,
    "endurance": 15.184,
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
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.3,
    "table": "Melee_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Melee_Slow"
    }
  }
};
