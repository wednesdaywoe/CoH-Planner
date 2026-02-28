/**
 * Frenzy
 * Melee(PBAoE), Heavy DMG(Energy), Foe -DEF
 */

import type { Power } from '@/types';

export const Frenzy: Power = {
  "name": "Frenzy",
  "available": 21,
  "description": "Your Crab Spider backpack arms go into a frenzy, striking all nearby foes with a barrage of attacks dealing heavy Energy damage in an area around you. Can also reduce the targets' Defense. Damage: Heavy",
  "shortHelp": "Melee(PBAoE), Heavy DMG(Energy), Foe -DEF",
  "icon": "crabspider_frenzy.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 20,
    "endurance": 18.2,
    "castTime": 2,
    "radius": 10,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 2.1,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
