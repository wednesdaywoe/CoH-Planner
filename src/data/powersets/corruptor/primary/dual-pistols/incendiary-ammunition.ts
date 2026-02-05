/**
 * Incendiary Ammunition
 * Toggle: Ammo Change (Fire), Special
 *
 * Source: corruptor_ranged/dual_pistols/incendiary_ammunition.json
 */

import type { Power } from '@/types';

export const IncendiaryAmmunition: Power = {
  "name": "Incendiary Ammunition",
  "internalName": "Incendiary_Ammunition",
  "available": -1,
  "description": "While this toggle is active you will be equipped with 'Incendiary Rounds.' Most of your Dual Pistol attacks will have their secondary damage converted to fire damage and inflict a minor damage over time effect.In order to earn this power, you must purchase the Swap Ammo power.",
  "shortHelp": "Toggle: Ammo Change (Fire), Special",
  "icon": "dualpistols_incendiaryammo.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.63
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "requires": "Corruptor_Ranged.Dual_Pistols.Swap_Ammo"
};
