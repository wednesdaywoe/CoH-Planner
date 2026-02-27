/**
 * Crushing Uppercut
 * Melee, Extreme DMG(Smash), Foe Knock Up, Disorient, Finisher
 *
 * Source: stalker_melee/brawling/crushing_uppercut.json
 */

import type { Power } from '@/types';

export const CrushingUppercut: Power = {
  "name": "Crushing Uppercut",
  "internalName": "Crushing_Uppercut",
  "available": 25,
  "description": "You perform a jaw breaking Crushing Uppercut on your target inflicting Extreme Smashing damage and knocking them into the air. Crushing Uppercut will leave the target disoriented for a short time. Crushing Uppercut is a Finisher and will set your Combo Level to 0. It will deal additional damage and have a longer disorient duration dependent upon the current Combo level. At Combo Level 3, Crushing Uppercut will have its disorient effect upgraded to a Hold effect. Critical damage is unaffected by your Combo Level.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Smash), Foe Knock Up, Disorient, Finisher",
  "icon": "brawling_crushinguppercut.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 13,
    "recharge": 25,
    "endurance": 14.352,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 3.18,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 3.339,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 3.5616,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 3.975,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 3.18,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 3.18,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockup": {
      "scale": 3,
      "table": "Melee_Knockback"
    },
    "stun": {
      "mag": 3,
      "scale": 7.5,
      "table": "Melee_Stun"
    },
    "hold": {
      "mag": 3,
      "scale": 10.5,
      "table": "Melee_Stun"
    }
  }
};
