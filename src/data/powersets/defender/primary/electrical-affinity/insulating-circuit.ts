/**
 * Insulating Circuit
 * Ranged (Chain), Ally +Absorb, Self +Static
 *
 * Source: defender_buff/shock_therapy/insulating_circuit.json
 */

import type { Power } from '@/types';

export const InsulatingCircuit: Power = {
  "name": "Insulating Circuit",
  "internalName": "Insulating_Circuit",
  "available": 21,
  "description": "Create a circuit of protective energy between several nearby allies, granting them a small protective shield. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Insulating Circuit grants 1 stack of Static.Recharge: Slow.",
  "shortHelp": "Ranged (Chain), Ally +Absorb, Self +Static",
  "icon": "shocktherapy_insulatingcircuit.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 20,
    "endurance": 13,
    "castTime": 1,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 2,
      "table": "Ranged_Heal"
    }
  }
};
