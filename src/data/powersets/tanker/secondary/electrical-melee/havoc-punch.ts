/**
 * Havoc Punch
 * Melee, DMG(Smash/Energy), Foe Sleep, -End
 *
 * Source: tanker_melee/electrical_melee/havoc_punch.json
 */

import type { Power } from '@/types';

export const HavocPunch: Power = {
  "name": "Havoc Punch",
  "internalName": "Havoc_Punch",
  "available": 0,
  "description": "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with a greater damage. Havoc Punch can drain some Endurance from your target and may overload their synapses, leaving him writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release him.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Sleep, -End",
  "icon": "electricmelee_targetedmoderatedmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Melee Damage",
    "Sleep",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.52,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceGain": {
      "scale": 3.432,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Melee_Ones"
    }
  }
};
