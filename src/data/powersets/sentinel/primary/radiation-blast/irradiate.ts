/**
 * Irradiate
 * Close (AoE), DoT(Energy), Foe -DEF
 *
 * Source: sentinel_ranged/radiation_blast/irradiate.json
 */

import type { Power } from '@/types';

export const Irradiate: Power = {
  "name": "Irradiate",
  "internalName": "Irradiate",
  "available": 1,
  "description": "You can emit lethal amounts of radiation in all directions, damaging all nearby foes for a short time. Like other Radiation attacks, this power can bypass some of a target's defenses. Irradiate severely reduces the target's Defense.",
  "shortHelp": "Close (AoE), DoT(Energy), Foe -DEF",
  "icon": "radiationburst_irradiate.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.1,
    "radius": 20,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.07,
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
  "damage": {
    "type": "Energy",
    "scale": 0.1,
    "table": "Ranged_Damage",
    "duration": 4.6,
    "tickRate": 0.5
  },
  "effects": {
    "defenseDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Def"
    }
  }
};
