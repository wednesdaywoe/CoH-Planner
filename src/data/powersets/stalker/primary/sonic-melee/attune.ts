/**
 * Attune
 * Melee Toggle, DMG(Energy), Foe DOT(Energy), Special
 *
 * Source: stalker_melee/sonic_melee/attune.json
 */

import type { Power } from '@/types';

export const Attune: Power = {
  "name": "Attune",
  "internalName": "Attune",
  "available": 1,
  "description": "A high-intensity sound wave that matches the resonant frequency of your target. This power inflicts continuous damage over time as well as making the target vulnerable to additional effects from all your attacks.",
  "shortHelp": "Melee Toggle, DMG(Energy), Foe DOT(Energy), Special",
  "icon": "sonicmanipulation_dot.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 20,
    "recharge": 0.5,
    "endurance": 0.104,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
