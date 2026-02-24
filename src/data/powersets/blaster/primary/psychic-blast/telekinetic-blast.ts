/**
 * Telekinetic Blast
 * Ranged, DMG(Smash/Psionic), Foe Knockback
 *
 * Source: blaster_ranged/psychic_blast/telekinetic_blast.json
 */

import type { Power } from '@/types';

export const TelekineticBlast: Power = {
  "name": "Telekinetic Blast",
  "internalName": "Telekinetic_Blast",
  "available": 1,
  "description": "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.",
  "shortHelp": "Ranged, DMG(Smash/Psionic), Foe Knockback",
  "icon": "psychicblast_telekineticblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 10,
    "endurance": 10.192,
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
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.46,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1.5,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 4,
      "table": "Ranged_Knockback"
    }
  }
};
