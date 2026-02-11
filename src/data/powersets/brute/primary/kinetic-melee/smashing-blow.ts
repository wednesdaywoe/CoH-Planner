/**
 * Smashing Blow
 * Melee, DMG(Smash/Energy), Foe Disorient
 *
 * Source: brute_melee/kinetic_attack/smashing_blow.json
 */

import type { Power } from '@/types';

export const SmashingBlow: Power = {
  "name": "Smashing Blow",
  "internalName": "Smashing_Blow",
  "available": 1,
  "description": "Smashing Blow is a slow attack, but makes up for it with a good amount of damage. Has a greater chance to stun than body blow.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Disorient",
  "icon": "kineticattack_smashingblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 7,
    "endurance": 7.696,
    "castTime": 1.2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.48,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.666,
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
