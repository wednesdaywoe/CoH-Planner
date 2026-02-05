/**
 * Hell on Earth
 * Ranged, Pet +Dmg, +To Hit, Summon Living Hellfire
 *
 * Source: mastermind_summon/demon_summoning/hell_on_earth.json
 */

import type { Power } from '@/types';

export const HellonEarth: Power = {
  "name": "Hell on Earth",
  "internalName": "Hell_on_Earth",
  "available": 17,
  "description": "A dark blessing is placed upon a selected Demon henchman which will increase its damage and chance to hit for 90 seconds. While this is in effect living hellfire may spawn every 15 seconds at the affected Demon henchman's location. The creatures summoned will have a very weak tie to the material plane and will return to Abyss after a short time.Recharge: Very Long.",
  "shortHelp": "Ranged, Pet +Dmg, +To Hit, Summon Living Hellfire",
  "icon": "demonsummoning_hellonearth.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 600,
    "endurance": 16.25,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 1,
      "table": "Ranged_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Ranged_Buff_Dmg"
    },
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Living_Hellfire"
    }
  }
};
