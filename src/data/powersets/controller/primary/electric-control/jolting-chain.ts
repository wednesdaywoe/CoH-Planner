/**
 * Jolting Chain
 * Ranged Chain AoE, DMG(Energy), Foe Knockdown, -End
 *
 * Source: controller_control/electric_control/jolting_chain.json
 */

import type { Power } from '@/types';

export const JoltingChain: Power = {
  "name": "Jolting Chain",
  "internalName": "Jolting_Chain",
  "available": 5,
  "description": "You can send a bolt of electricity through multiple opponents, causing a muscle spasm and dealing minor damage. Each foe is knocked down, and the electric charge can fork several times, jumping to several opponents rapidly.",
  "shortHelp": "Ranged Chain AoE, DMG(Energy), Foe Knockdown, -End",
  "icon": "electriccontrol_joltingchain.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 8,
    "endurance": 10.4,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1.2,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.2,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.66,
      "table": "Ranged_Ones"
    },
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
