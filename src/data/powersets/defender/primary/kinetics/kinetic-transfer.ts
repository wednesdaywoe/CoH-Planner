/**
 * Fulcrum Shift
 * Ranged (Foe AoE), Foe -DMG, Team +DMG
 *
 * Source: defender_buff/kinetics/kinetic_transfer.json
 */

import type { Power } from '@/types';

export const FulcrumShift: Power = {
  "name": "Fulcrum Shift",
  "internalName": "Kinetic_Transfer",
  "available": 25,
  "description": "Fulcrum Shift drains the power of a targeted foe and all foes nearby, transferring it to all adjacent allies, the caster, and those near the caster. Affected foes will deal less damage, while your affected allies will deal more. The more foes that are affected, the more power your allies receive. Fulcrum Shift can dramatically turn the tide of a melee battle.Recharge: Slow.",
  "shortHelp": "Ranged (Foe AoE), Foe -DMG, Team +DMG",
  "icon": "kineticboost_kinetictransfer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6
};
