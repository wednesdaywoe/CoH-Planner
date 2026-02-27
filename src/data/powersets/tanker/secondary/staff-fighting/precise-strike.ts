/**
 * Precise Strike
 * Melee, DMG(Smash), Foe Disorient
 *
 * Source: tanker_melee/staff_fighting/precise_strike.json
 */

import type { Power } from '@/types';

export const PreciseStrike: Power = {
  "name": "Precise Strike",
  "internalName": "Precise_Strike",
  "available": 0,
  "description": "You attempt to daze your foe with a heavy staff blow to their head. Precise Strike has a higher chance to hit than normal, deals Smashing damage, and has a small chance to disorient the target briefly. While a form is active, this power will build one level of Perfection.",
  "shortHelp": "Melee, DMG(Smash), Foe Disorient",
  "icon": "stafffighting_precisestrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 9,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.13
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
  "requires": "!Tanker_Defense.Shield_Defense",
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.594,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
