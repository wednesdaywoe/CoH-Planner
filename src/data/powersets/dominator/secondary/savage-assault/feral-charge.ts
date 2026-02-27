/**
 * Feral Charge
 * Melee, DMG(Lethal), Foe DoT (Lethal), +3 Blood Frenzy, Self Teleport
 *
 * Source: dominator_assault/savage_assault/feral_charge.json
 */

import type { Power } from '@/types';

export const FeralCharge: Power = {
  "name": "Feral Charge",
  "internalName": "Feral_Charge",
  "available": 29,
  "description": "You throw yourself at your target while slashing and tearing wildly dealing moderate lethal damage and causing it to suffer from additional minor lethal damage over time. The damage of this power can increase based on how far away you charge from, with up to double damage dealt at its strongest. Feral Charge builds 1 stacks of Blood Frenzy for every 20 ft in between your target and you, up to 3 stacks.Damage: Light.Recharge: Moderate.",
  "shortHelp": "Melee, DMG(Lethal), Foe DoT (Lethal), +3 Blood Frenzy, Self Teleport",
  "icon": "savagemelee_feralcharge.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.19,
    "castTime": 1.1667
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Teleport",
    "Universal Damage Sets",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "teleport": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
