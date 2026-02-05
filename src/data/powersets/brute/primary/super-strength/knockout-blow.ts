/**
 * Knockout Blow
 * Melee, DMG(Smashing), Foe Hold
 *
 * Source: brute_melee/super_strength/knockout_blow.json
 */

import type { Power } from '@/types';

export const KnockoutBlow: Power = {
  "name": "Knockout Blow",
  "internalName": "Knockout_Blow",
  "available": 7,
  "description": "You can perform a Knockout Blow on your opponent. This punch does Superior damage, and has a great chance of Holding your target.",
  "shortHelp": "Melee, DMG(Smashing), Foe Hold",
  "icon": "superstrength_knockoutblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 13.2,
    "recharge": 25,
    "endurance": 18.512,
    "castTime": 2.23
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Holds",
    "Knockback",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 3.56,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.602,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Stun"
    },
    "knockup": {
      "scale": 3,
      "table": "Melee_Knockback"
    }
  }
};
