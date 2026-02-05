/**
 * Summon Demon Prince
 * Summon Demon Prince
 *
 * Source: mastermind_summon/demon_summoning/summon_demon_prince.json
 */

import type { Power } from '@/types';

export const SummonDemonPrince: Power = {
  "name": "Summon Demon Prince",
  "internalName": "Summon_Demon_Prince",
  "available": 21,
  "description": "Summons forth a foul Demon Prince from the deepest reaches of the Abyss. The Demon Prince is mighty among its kind and is a master of cold powers. It serves the conjuror only so that it may wreak havoc upon the material plane. The Demon has some defense versus lethal, smashing, fire and cold attacks.You may only have 1 Demon Prince under your control at any given time. If you attempt to summon another Demon Prince the power will fail.Notes: Summon Demon Prince is unaffected by Recharge Time changes.Recharge: Slow.",
  "shortHelp": "Summon Demon Prince",
  "icon": "demonsummoning_summondemonprince.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 15,
    "endurance": 13.18,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Sleep",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Sleep",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Demon_Prince"
    }
  }
};
