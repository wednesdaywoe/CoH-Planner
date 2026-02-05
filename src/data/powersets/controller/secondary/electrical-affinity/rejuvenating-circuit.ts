/**
 * Rejuvenating Circuit
 * Ranged (Chain), Ally Heal, Self +Static
 *
 * Source: controller_buff/shock_therapy/rejuvenating_circuit.json
 */

import type { Power } from '@/types';

export const RejuvenatingCircuit: Power = {
  "name": "Rejuvenating Circuit",
  "internalName": "Rejuvenating_Circuit",
  "available": 0,
  "description": "Create a circuit of healing energy between several nearby allies, healing them for a small amount. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Rejuvenating Circuit grants 1 stack of Static.Recharge: Moderate.",
  "shortHelp": "Ranged (Chain), Ally Heal, Self +Static",
  "icon": "shocktherapy_rejuvenatingcircuit.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 8,
    "endurance": 13,
    "castTime": 1.17,
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
  "damage": {
    "type": "Heal",
    "scale": 1.55,
    "table": "Ranged_Heal"
  }
};
