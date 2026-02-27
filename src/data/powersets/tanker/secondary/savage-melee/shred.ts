/**
 * Shred
 * Melee (Cone), Foe DoT (Lethal), -Def(All), Self +1 Blood Frenzy
 *
 * Source: tanker_melee/savage_melee/shred.json
 */

import type { Power } from '@/types';

export const Shred: Power = {
  "name": "Shred",
  "internalName": "Shred",
  "available": 3,
  "description": "You rapidly slash at your foes several times causing a moderate amount of damage to all enemies in front of you and reduce their defense. Shred also causes minor lethal damage over time. This power grants 1 stack of Blood Frenzy.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Cone), Foe DoT (Lethal), -Def(All), Self +1 Blood Frenzy",
  "icon": "savagemelee_shred.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.3963,
    "recharge": 7.5,
    "endurance": 8.11,
    "castTime": 2.17,
    "maxTargets": 5
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
    "Defense Debuff",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.21,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.35
    },
    {
      "type": "Fire",
      "scale": 0.0946,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.35
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Def"
    }
  }
};
