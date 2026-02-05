/**
 * Dominate Will
 * Ranged, DMG(Psionic), Foe Sleep
 *
 * Source: blaster_ranged/psychic_blast/will_domination.json
 */

import type { Power } from '@/types';

export const DominateWill: Power = {
  "name": "Dominate Will",
  "internalName": "Will_Domination",
  "available": 0,
  "description": "This attack deals Psionic damage, and is capable of rendering its target unconscious. The victim is asleep, and will wake if disturbed.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Sleep",
  "icon": "psychicblast_willdomination.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
