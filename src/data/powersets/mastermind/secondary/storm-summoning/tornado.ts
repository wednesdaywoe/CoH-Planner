/**
 * Tornado
 * Summon Tornado: PBAoE Minor DMG(Smash), Foe Knockback, Fear, Disorient
 *
 * Source: mastermind_buff/storm_summoning/tornado.json
 */

import type { Power } from '@/types';

export const Tornado: Power = {
  "name": "Tornado",
  "internalName": "Tornado",
  "available": 27,
  "description": "Conjures up a funnel cloud at a targeted location. The Tornado will chase down your foes, tossing them into the air and hurling them great distances. The victims are left Disoriented and with reduced Defense. The Tornado is a menacing sight, and can even cause panic among your foes.Recharge: Slow.",
  "shortHelp": "Summon Tornado: PBAoE Minor DMG(Smash), Foe Knockback, Fear, Disorient",
  "icon": "stormsummoning_tornado.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.3,
    "range": 60,
    "recharge": 60,
    "endurance": 26,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Tornado",
      "duration": 30,
      "copyBoosts": true
    }
  }
};
