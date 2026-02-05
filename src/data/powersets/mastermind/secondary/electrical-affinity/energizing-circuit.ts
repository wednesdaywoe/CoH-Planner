/**
 * Energizing Circuit
 * Ranged (Chain), Ally +End, +Recharge, Self +Static
 *
 * Source: mastermind_buff/shock_therapy/energizing_circuit.json
 */

import type { Power } from '@/types';

export const EnergizingCircuit: Power = {
  "name": "Energizing Circuit",
  "internalName": "Energizing_Circuit",
  "available": 9,
  "description": "Create a circuit of pure energy between several nearby allies, restoring a small amount of their endurance and significantly increasing their attack rate for a short time. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Energizing Circuit grants 1 stack of Static.Recharge: Slow.",
  "shortHelp": "Ranged (Chain), Ally +End, +Recharge, Self +Static",
  "icon": "shocktherapy_energizingcircuit.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 35,
    "endurance": 16.25,
    "castTime": 1.67,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 25,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 1.25,
      "table": "Melee_Ones"
    }
  }
};
