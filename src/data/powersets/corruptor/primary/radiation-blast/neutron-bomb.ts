/**
 * Neutron Bomb
 * Ranged (Targeted AoE), DMG(Energy), Foe -DEF
 *
 * Source: corruptor_ranged/radiation_blast/neutron_bomb.json
 */

import type { Power } from '@/types';

export const NeutronBomb: Power = {
  "name": "Neutron Bomb",
  "internalName": "Neutron_Bomb",
  "available": 21,
  "description": "This devastating attack lobs an explosive sphere of deadly radiation, damaging the target and all nearby foes. Neutron Bomb can bypass some of a target's defenses and reduce the target's Defense.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Foe -DEF",
  "icon": "radiationburst_radiationblast.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "maxTargets": 16
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
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.9,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.9,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
