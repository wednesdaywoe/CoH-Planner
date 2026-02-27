/**
 * Heat Loss
 * Ranged (Foe AoE), Foe -RES, -END, Slow; Team +END, +Recovery
 *
 * Source: corruptor_buff/cold_domination/heat_loss.json
 */

import type { Power } from '@/types';

export const HeatLoss: Power = {
  "name": "Heat Loss",
  "internalName": "Heat_Loss",
  "available": 29,
  "description": "Heat Loss drains the heat from your enemies and transfers that energy to your allies in the form of Endurance. All foes near the selected target may experience a Heat Loss, which will drain their Endurance, Slow them, and reduce their Damage Resistance. Allies near the target are granted Endurance and a boost to their Recovery. Some Endurance and Recovery will also be transferred directly to you and any allies near you.Recharge: Very Long.",
  "shortHelp": "Ranged (Foe AoE), Foe -RES, -END, Slow; Team +END, +Recovery",
  "icon": "colddomination_heatloss.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 360,
    "endurance": 15.6,
    "castTime": 2.17
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Slow Movement"
  ],
  "maxSlots": 6
};
