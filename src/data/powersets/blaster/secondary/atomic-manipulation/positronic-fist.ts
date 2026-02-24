/**
 * Positronic Fist
 * Melee, DMG(Energy/Smash), Foe Disorient, -DEF, +Positrons
 *
 * Source: blaster_support/radiation_manipulation/positronic_fist.json
 */

import type { Power } from '@/types';

export const PositronicFist: Power = {
  "name": "Positronic Fist",
  "internalName": "Positronic_Fist",
  "available": 29,
  "description": "You hammer your foe with a brutal smashing attack charged with a lethal dose of radiation. Your target will suffer Energy and Smashing damage, will have its defense reduced and will be disoriented for a short time in addition to being surrounded by positively charged particles. Hitting a foe that has negatively charged particles will trigger a Gamma Burst.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Disorient, -DEF, +Positrons",
  "icon": "atomicmanipulation_heavypunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.89,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.67,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    }
  }
};
