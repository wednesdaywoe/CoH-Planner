/**
 * Cryo Ammunition
 * Toggle: Ammo Change (Cold), Special
 *
 * Source: blaster_ranged/dual_pistols/cryo_ammunition.json
 */

import type { Power } from '@/types';

export const CryoAmmunition: Power = {
  "name": "Cryo Ammunition",
  "internalName": "Cryo_Ammunition",
  "available": -1,
  "description": "While this toggle is active you will be equipped with 'Cryo Rounds'. Most of your Dual Pistol attacks will have their secondary damage converted to cold damage and inflict a minor slow effect on the target.In order to earn this power, you must purchase the Swap Ammo power.",
  "shortHelp": "Toggle: Ammo Change (Cold), Special",
  "icon": "dualpistols_cryoammo.png",
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
  "requires": "Blaster_Ranged.Dual_Pistols.Swap_Ammo"
};
