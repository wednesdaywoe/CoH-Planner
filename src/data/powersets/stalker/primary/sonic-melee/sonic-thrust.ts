/**
 * Sonic Thrust
 * Melee, DMG(Energy/Smash), Foe Knockback, -Res(Debuffs)
 *
 * Source: stalker_melee/sonic_melee/sonic_thrust.json
 */

import type { Power } from '@/types';

export const SonicThrust: Power = {
  "name": "Sonic Thrust",
  "internalName": "Sonic_Thrust",
  "available": 0,
  "description": "A focused attack of intense sonic power with high chance to violently knock a nearby foe off their feet. Deals minimal damage, but can be very effective. This power will inflict a strong additional damage over time effect for 25 seconds against Attuned targets.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Knockback, -Res(Debuffs)",
  "icon": "sonicmanipulation_sonicthrust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 2.5,
    "endurance": 3.952,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.76,
    "table": "Melee_Damage"
  }
};
