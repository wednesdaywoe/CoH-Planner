/**
 * Psychic Scream
 * Ranged (Cone), Light DMG(Psionic), Foe -Recharge
 *
 * Source: sentinel_ranged/psychic_blast/psychic_scream.json
 */

import type { Power } from '@/types';

export const PsychicScream: Power = {
  "name": "Psychic Scream",
  "internalName": "Psychic_Scream",
  "available": 1,
  "description": "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Psionic), Foe -Recharge",
  "icon": "psychicblast_psychicscream.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 1.2217,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.87,
    "maxTargets": 6
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
    "Sentinel Archetype Sets",
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
    }
  }
};
