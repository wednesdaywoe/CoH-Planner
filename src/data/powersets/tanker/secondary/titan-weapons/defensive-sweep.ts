/**
 * Defensive Sweep
 * Melee(Cone), DMG(Smashing), Self +DEF(Melee, Smash)
 *
 * Source: tanker_melee/titan_weapons/defensive_sweep.json
 */

import type { Power } from '@/types';

export const DefensiveSweep: Power = {
  "name": "Defensive Sweep",
  "internalName": "Defensive_Sweep",
  "available": 0,
  "description": "You take a defensive stance and strike your opponents. Successfully executing this attack will cause light smashing damage to nearby foes, while giving you increased defense against their melee and smashing attacks.",
  "shortHelp": "Melee(Cone), DMG(Smashing), Self +DEF(Melee, Smash)",
  "icon": "titanweapons_defensivesweep.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "radius": 15,
    "arc": 2.0944,
    "recharge": 4,
    "endurance": 5.356,
    "castTime": 2.2,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "requires": "!Tanker_Defense.Shield_Defense"
};
