/**
 * Telekinetic Blast
 * Ranged, Light DMG(Smash/Psionic), Foe Knockback
 *
 * Source: sentinel_ranged/psychic_blast/telekinetic_blast.json
 */

import type { Power } from '@/types';

export const TelekineticBlast: Power = {
  "name": "Telekinetic Blast",
  "internalName": "Telekinetic_Blast",
  "available": 0,
  "description": "You can use Telekinesis to Blast a targeted foe with the power of your mind. This attack deals Smashing and Psionic damage, and can knock your opponent back.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Smash/Psionic), Foe Knockback",
  "icon": "psychicblast_telekineticblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 75,
    "recharge": 6,
    "endurance": 6.864,
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
    "Knockback",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.32,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1,
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
