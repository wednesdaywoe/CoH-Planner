/**
 * Pummel
 * Melee, Minor DMG(Smash)
 *
 * Source: arachnos_soldiers/arachnos_soldier/pummel.json
 */

import type { Power } from '@/types';

export const Pummel: Power = {
  "name": "Pummel",
  "available": 0,
  "description": "You can smash your opponents in close combat with the butt of your sub-machine gun to deal minor smashing damage. Pummel has a high chance to disorient your foe for a brief time. NOTE: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Bane Spider Cloaking Device. Damage: Minor",
  "shortHelp": "Melee, Minor DMG(Smash)",
  "icon": "arachnossoldier_pummel.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 6,
      "table": "Melee_Stun"
    }
  }
};
