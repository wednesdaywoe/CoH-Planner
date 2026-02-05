/**
 * Atomic Blast
 * PBAoE, DMG(Energy/Smash), Foe Hold, -DEF
 *
 * Source: blaster_ranged/radiation_blast/atomic_blast.json
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
    "radius": 25,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 2.93,
    "maxTargets": 16
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
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 3,
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
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
