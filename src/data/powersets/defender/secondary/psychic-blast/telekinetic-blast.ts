/**
 * Telekinetic Blast
 * Ranged, DMG(Smash/Psionic), Foe Knockback
 *
 * Source: defender_ranged/psychic_blast/telekinetic_blast.json
 */

import type { Power } from '@/types';

export const TelekineticBlast: Power = {
  "name": "Telekinetic Blast",
  "internalName": "Telekinetic_Blast",
  "available": 3,
  "description": "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.",
  "shortHelp": "Ranged, DMG(Smash/Psionic), Foe Knockback",
  "icon": "psychicblast_telekineticblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1,
      "table": "Ranged_Damage"
    }
  ]
};
