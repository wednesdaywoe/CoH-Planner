/**
 * Atomic Blast
 * PBAoE, DMG(Energy/Smash), Foe Hold, -DEF
 *
 * Source: sentinel_ranged/radiation_blast/atomic_blast.json
 */

import type { Power } from '@/types';

export const AtomicBlast: Power = {
  "name": "Atomic Blast",
  "internalName": "Atomic_Blast",
  "available": 25,
  "description": "This attack taps most of your stored energy to deal a devastating Atomic Blast which deals Extreme Energy and Smashing damage. Any foes left standing will have their Defense greatly reduced and may be left helplessly choking on toxic vapors.",
  "shortHelp": "PBAoE, DMG(Energy/Smash), Foe Hold, -DEF",
  "icon": "radiationburst_atomicblast.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.93,
    "maxTargets": 10
  },
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
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.928,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.253,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    },
    "defenseDebuff": {
      "scale": 4,
      "table": "Ranged_Debuff_Def"
    }
  }
};
