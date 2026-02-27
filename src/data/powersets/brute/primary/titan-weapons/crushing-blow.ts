/**
 * Crushing Blow
 * Melee, DMG(Smashing), -DEF
 *
 * Source: brute_melee/titan_weapons/crushing_blow.json
 */

import type { Power } from '@/types';

export const CrushingBlow: Power = {
  "name": "Crushing Blow",
  "internalName": "Crushing_Blow",
  "available": 0,
  "description": "You swing a mighty crushing blow at your opponent dealing High Smashing damage and reducing their defense.",
  "shortHelp": "Melee, DMG(Smashing), -DEF",
  "icon": "titanweapons_crushingblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 9,
    "recharge": 8,
    "endurance": 8.7838,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "requires": "!Brute_Defense.Shield_Defense"
};
