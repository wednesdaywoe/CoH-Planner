/**
 * Benumb
 * Ranged Foe -DMG, -END, -Regeneration, -Special
 *
 * Source: controller_buff/cold_domination/benumb.json
 */

import type { Power } from '@/types';

export const Benumb: Power = {
  "name": "Benumb",
  "internalName": "Benumb",
  "available": 23,
  "description": "Numbs a single target to its very core. Benumb reduces the target's core body temperature, dramatically weakening them. A Benumbed target's Damage and Regeneration Rate are greatly reduced. Additionally, the affected target's secondary power effects are all weakened. The target's powers' effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all weakened.Recharge: Long.",
  "shortHelp": "Ranged Foe -DMG, -END, -Regeneration, -Special",
  "icon": "colddomination_benumb.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 120,
    "endurance": 13,
    "castTime": 2.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "regenDebuff": {
      "scale": 5,
      "table": "Ranged_Ones"
    },
    "enduranceDrain": {
      "scale": 0.05,
      "table": "Ranged_Ones"
    },
    "damageDebuff": {
      "scale": 5,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
