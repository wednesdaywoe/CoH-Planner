/**
 * Radiant Strike
 * Melee, High DMG(Smash/Energy), Foe -DEF, Knockback, -Fly
 *
 * Source: peacebringer_offensive/luminous_blast/radiant_strike.json
 */

import type { Power } from '@/types';

export const RadiantStrike: Power = {
  "name": "Radiant Strike",
  "available": 5,
  "description": "The Radiant Strike is a slow melee attack, but makes up for it with superior damage. Radiant Strike releases Kheldian light on impact, which can Knock Back foes, bring down fliers, and reduce a target's Defense.  Damage: High. Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Smash/Energy), Foe -DEF, Knockback, -Fly",
  "icon": "luminousblast_radiantstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.07
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.96,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Melee_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1,
        "table": "Melee_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
