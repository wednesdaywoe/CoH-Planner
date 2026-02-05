/**
 * Atom Smasher
 * PBAoE, DMG(Toxic/Energy), Foe Disorient, -DEF, Special
 *
 * Source: blaster_support/radiation_manipulation/atom_smasher.json
 */

import type { Power } from '@/types';

export const AtomSmasher: Power = {
  "name": "Atom Smasher",
  "internalName": "Atom_Smasher",
  "available": 23,
  "description": "You charge up a dangerously unstable amount of radioactive energy into a single fist before driving it into the ground and causing a small explosion. Foes caught in the blast will suffer Energy and Toxic damage and have their defense reduced.",
  "shortHelp": "PBAoE, DMG(Toxic/Energy), Foe Disorient, -DEF, Special",
  "icon": "atomicmanipulation_atomsmasher.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 22,
    "endurance": 20.176,
    "castTime": 2.93,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
