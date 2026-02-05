/**
 * Havoc Punch
 * Melee, DMG(Smash/Energy), Foe Sleep, -End, Knock back
 *
 * Source: blaster_support/electricity_manipulation/havok_punch.json
 */

import type { Power } from '@/types';

export const HavocPunch: Power = {
  "name": "Havoc Punch",
  "internalName": "Havok_Punch",
  "available": 9,
  "description": "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with greater damage. Havoc Punch can knock down targets, drain some Endurance from your target, or even overload their synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release them.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Sleep, -End, Knock back",
  "icon": "electricitymanipulation_havokpunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 14,
    "endurance": 13.52,
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
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Knockback",
    "Melee Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.6,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Sleep"
    },
    "knockback": {
      "scale": 0.75,
      "table": "Melee_Knockback"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 6.76,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.099,
      "table": "Melee_Ones"
    }
  }
};
