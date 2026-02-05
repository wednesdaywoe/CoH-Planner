/**
 * Stygian Return
 * Self Rez, Special
 *
 * Source: warshade/umbral-aura
 */

import type { Power } from '@/types';

export const StygianReturn: Power = {
  "name": "Stygian Return",
  "available": 29,
  "description": "Should you fall in battle, your Stygian Return can drain the life force of all foes around you to bring yourself back from the brink of death. The more foes nearby, the more Ht Points and Endurance are restored to you. Stygian Return will actually leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds. There must be at least one foe nearby to fuel the Transfer and revive yourself.  Damage: Light. Recharge: Very Long.",
  "shortHelp": "Self Rez, Special",
  "icon": "umbralaura_stygianreturn.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Recharge",
    "Healing",
    "Damage"
  ],
  "allowedSetCategories": [
    "Healing",
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "castTime": 1.17,
    "radius": 25,
    "maxTargets": 10
  },
  "targetType": "Self"
};
