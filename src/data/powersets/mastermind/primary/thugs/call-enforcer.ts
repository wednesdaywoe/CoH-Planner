/**
 * Call Enforcer
 * Summon Enforcer
 *
 * Source: mastermind_summon/thugs/call_enforcer.json
 */

import type { Power } from '@/types';

export const CallEnforcer: Power = {
  "name": "Call Enforcer",
  "internalName": "Call_Enforcer",
  "available": 11,
  "description": "Calls forth one to two Thug Enforcers (depending on your level) to do your bidding. Thug Enforcers carry a Sub-machine Gun, and possess good leadership skills. Their weapon of choice is an UZI, and can be equipped to carry up to 2 at once.You may only have 2 Thug Enforcers under your control at any given time. If you attempt to call more Enforcers, you can only replace the ones you have lost in battle. If you already have two, the power will fail.Notes: Call Enforcer is unaffected by Recharge Time changes.Recharge: Moderate.",
  "shortHelp": "Summon Enforcer",
  "icon": "thugs_enlistlieutenant.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 10,
    "endurance": 9.62,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Defense Sets",
    "Holds",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Stuns",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "MastermindPets_Thug_Lt"
    }
  }
};
