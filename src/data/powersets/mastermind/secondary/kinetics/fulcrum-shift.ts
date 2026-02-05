/**
 * Fulcrum Shift
 * Ranged (Foe AoE), Foe -DMG, Team +DMG
 *
 * Source: mastermind_buff/kinetics/fulcrum_shift.json
 */

import type { Power } from '@/types';

export const FulcrumShift: Power = {
  "name": "Fulcrum Shift",
  "internalName": "Fulcrum_Shift",
  "available": 29,
  "description": "Fulcrum Shift drains the power of a targeted foe and all foes nearby, transferring it to all adjacent allies, you, and those near you. Affected foes will deal less damage, while your affected allies will deal more. The more foes that are affected, the more power you and your allies receive. Fulcrum Shift can dramatically turn the tide of a battle.Recharge: Slow.",
  "shortHelp": "Ranged (Foe AoE), Foe -DMG, Team +DMG",
  "icon": "kineticboost_kinetictransfer.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 60,
    "endurance": 19.5,
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
