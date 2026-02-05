/**
 * Electron Haze
 * Close, DMG(Energy), Foe -DEF, Knockback
 *
 * Source: sentinel_ranged/radiation_blast/electron_haze.json
 */

import type { Power } from '@/types';

export const ElectronHaze: Power = {
  "name": "Electron Haze",
  "internalName": "Electron_Haze",
  "available": 11,
  "description": "A short range conical blast of free electrons. This attack can bypass some of a target's defenses and reduce the target's Defense. It can also knock some targets down.",
  "shortHelp": "Close, DMG(Energy), Foe -DEF, Knockback",
  "icon": "radiationburst_electronhaze.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.1,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.37,
    "maxTargets": 6
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
    "Defense Debuff",
    "Knockback",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.35,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    }
  }
};
