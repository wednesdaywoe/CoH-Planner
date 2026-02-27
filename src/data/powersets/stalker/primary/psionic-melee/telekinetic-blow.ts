/**
 * Telekinetic Blow
 * Melee, DMG(Psionic/Smash), Foe Knock Up, Self +Insight
 *
 * Source: stalker_melee/psionic_melee/telekinetic_blow.json
 */

import type { Power } from '@/types';

export const TelekineticBlow: Power = {
  "name": "Telekinetic Blow",
  "internalName": "Telekinetic_Blow",
  "available": 1,
  "description": "You project telekinetic energy around your fist before delivering a shattering uppercut to your foe dealing high Psionic and Smashing damage and sending them flying into the air. Telekinetic Blow has a high chance of granting you Insight. While you have Insight, Telekinetic Blow will deal additional minor psionic damage over time.",
  "shortHelp": "Melee, DMG(Psionic/Smash), Foe Knock Up, Self +Insight",
  "icon": "psionicmelee_telekineticblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.47
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.45,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1.35,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockup": {
      "scale": 1,
      "table": "Melee_Knockback"
    }
  }
};
