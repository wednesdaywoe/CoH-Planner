/**
 * Swap Ammo
 * Change Secondary Damage/Effects
 *
 * Source: corruptor_ranged/dual_pistols/swap_ammo.json
 */

import type { Power } from '@/types';

export const SwapAmmo: Power = {
  "name": "Swap Ammo",
  "internalName": "Swap_Ammo",
  "available": 5,
  "description": "By purchasing this power, you will be granted the Cryo Ammunition, Incendiary Ammunition and Chemical Ammunition toggles. Activating these toggles will change your secondary damage type on most Dual Pistols attacks from lethal (Standard Rounds) to cold (Cryo Rounds), fire (Incendiary Rounds) or toxic (Chemical Rounds).These toggles are mutually exclusive and only one can be active at a time. If no Swap Ammo toggles are active, the player will revert to Standard Ammunition.Different ammo types also have different secondary effects. Examine your Dual Pistols powers for more information.",
  "shortHelp": "Change Secondary Damage/Effects",
  "icon": "dualpistols_swapammo.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6
};
