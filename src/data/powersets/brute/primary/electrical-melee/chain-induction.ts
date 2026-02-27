/**
 * Chain Induction
 * Melee, DMG(Energy), Foe -End +Special
 *
 * Source: brute_melee/electrical_melee/chain_induction.json
 */

import type { Power } from '@/types';

export const ChainInduction: Power = {
  "name": "Chain Induction",
  "internalName": "Chain_Induction",
  "available": 17,
  "description": "This Electric Melee attack deals moderate Smashing and Energy damage and may drain some of the targets Endurance. However, this attack also induces an unstable electric charge that may jump to another enemy target. The charge will jump to the closest enemy in range that has not been previously hit, until it inevitably dissipates. Enhancements and Fury will boost the effectiveness of the initial attack as well as the jumping charge.",
  "shortHelp": "Melee, DMG(Energy), Foe -End +Special",
  "icon": "electricmelee_targetedchaininduction.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 14,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Endurance Modification",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.32,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Melee_Ones"
    },
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Chain_Induction_Jump1",
      "duration": 1
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
