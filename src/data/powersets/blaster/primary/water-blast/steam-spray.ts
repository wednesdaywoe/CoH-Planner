/**
 * Steam Spray
 * Ranged (Cone), DMG(Fire), Foe -Defense, DoT(Fire), +Wet, Self +Tidal Power
 *
 * Source: blaster_ranged/water_blast/steam_spray.json
 */

import type { Power } from '@/types';

export const SteamSpray: Power = {
  "name": "Steam Spray",
  "internalName": "Steam_Spray",
  "available": 21,
  "description": "You spray scalding hot steam in a cone in front of you badly burning affected targets. Steam Spray causes Fire damage, Fire damage over time and reduces the target's Defense slightly. Steam Spray grants 1 stack of Tidal Power.",
  "shortHelp": "Ranged (Cone), DMG(Fire), Foe -Defense, DoT(Fire), +Wet, Self +Tidal Power",
  "icon": "waterblast_steamspray.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.2,
    "range": 40,
    "radius": 40,
    "arc": 0.8727,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.53,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.835,
      "table": "Ranged_Damage",
      "duration": 0.6,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
