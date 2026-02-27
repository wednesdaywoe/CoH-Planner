/**
 * Body Blow
 * Melee, DMG(Smash/Energy), Foe Disorient
 *
 * Source: tanker_melee/kinetic_attack/body_blow.json
 */

import type { Power } from '@/types';

export const BodyBlow: Power = {
  "name": "Body Blow",
  "internalName": "Body_Blow",
  "available": 0,
  "description": "A much more powerful, yet slower version of Quick Strike. Body Blow is capable of stunning an opponent occasionally.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Disorient",
  "icon": "kineticattack_bodyblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.29,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.87,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.522,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 6,
      "table": "Melee_Stun"
    },
    "damageDebuff": {
      "scale": 0.7,
      "table": "Melee_Debuff_Dam"
    }
  }
};
