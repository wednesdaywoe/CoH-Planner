/**
 * Empowering Circuit
 * Ranged (Chain), Ally +DMG, +Tohit, Self +Static
 *
 * Source: controller_buff/shock_therapy/empowering_circuit.json
 */

import type { Power } from '@/types';

export const EmpoweringCircuit: Power = {
  "name": "Empowering Circuit",
  "internalName": "Empowering_Circuit",
  "available": 19,
  "description": "Create a circuit of empowering energy between several nearby allies, increasing their damage output and chance to hit for a short time. Every stack of Static you have will cause this power to chain to additional allies. The first few targets in the chain receive a more potent effect. Empowering Circuit grants 1 stack of Static.Recharge: Slow.",
  "shortHelp": "Ranged (Chain), Ally +DMG, +Tohit, Self +Static",
  "icon": "shocktherapy_empoweringcircuit.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 15,
    "endurance": 13,
    "castTime": 1,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 3,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 1.2,
      "table": "Ranged_Buff_ToHit"
    }
  }
};
