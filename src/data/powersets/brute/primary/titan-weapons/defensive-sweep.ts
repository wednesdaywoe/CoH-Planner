/**
 * Defensive Sweep
 * Melee(Cone), DMG(Smashing), Self +DEF(Melee, Smash)
 *
 * Source: brute_melee/titan_weapons/defensive_sweep.json
 */

import type { Power } from '@/types';

export const DefensiveSweep: Power = {
  "name": "Defensive Sweep",
  "internalName": "Defensive_Sweep",
  "available": 0,
  "description": "You take a defensive stance and strike your opponents. Successfully executing this attack will cause light smashing damage to nearby foes, while giving you increased defense against their melee and smashing attacks.Notes: Defensive Sweep is unaffected by Arc changes.",
  "shortHelp": "Melee(Cone), DMG(Smashing), Self +DEF(Melee, Smash)",
  "icon": "titanweapons_defensivesweep.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 10,
    "radius": 10,
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
    "Brute Archetype Sets",
    "Defense Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "requires": "!Brute_Defense.Shield_Defense"
};
