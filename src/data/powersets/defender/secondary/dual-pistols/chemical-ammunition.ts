/**
 * Chemical Ammunition
 * Toggle: Ammo Change (Toxic), Special
 *
 * Source: defender_ranged/dual_pistols/chemical_ammunition.json
 */

import type { Power } from '@/types';

export const ChemicalAmmunition: Power = {
  "name": "Chemical Ammunition",
  "internalName": "Chemical_Ammunition",
  "available": -1,
  "description": "While this toggle is active you will be equipped with 'Chemical Rounds.' Most of your Dual Pistol attacks will have their secondary damage converted to toxic damage and inflict a minor damage debuff effect on the target.In order to earn this power, you must purchase the Swap Ammo power.",
  "shortHelp": "Toggle: Ammo Change (Toxic), Special",
  "icon": "dualpistols_chemicalammo.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.63
  },
  "allowedEnhancements": [],
  "maxSlots": 0,
  "mechanicType": "childToggle",
  "requires": "Defender_Ranged.Dual_Pistols.Swap_Ammo"
};
