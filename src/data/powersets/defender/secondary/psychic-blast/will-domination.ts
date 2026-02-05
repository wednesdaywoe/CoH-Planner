/**
 * Will Domination
 * Ranged, DMG(Psionic), Foe Sleep
 *
 * Source: defender_ranged/psychic_blast/will_domination.json
 */

import type { Power } from '@/types';

export const WillDomination: Power = {
  "name": "Will Domination",
  "internalName": "Will_Domination",
  "available": 15,
  "description": "This powerful attack deals Psionic damage, and is so painful it usually renders its target unconscious. The victim is asleep, and will wake if disturbed.",
  "shortHelp": "Ranged, DMG(Psionic), Foe Sleep",
  "icon": "psychicblast_willdomination.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 10,
    "endurance": 11.856,
    "castTime": 1.1
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
    "Defender Archetype Sets",
    "Ranged Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 2.28,
    "table": "Ranged_Damage"
  }
};
