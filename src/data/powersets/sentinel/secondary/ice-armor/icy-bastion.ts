/**
 * Icy Bastion
 * Toggle: Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, Invulnerable; Self Hold
 *
 * Source: sentinel_defense/ice_armor/icy_bastion.json
 */

import type { Power } from '@/types';

export const IcyBastion: Power = {
  "name": "Icy Bastion",
  "internalName": "Icy_Bastion",
  "available": 29,
  "description": "You encase yourself in a block of solid ice, rendering yourself invulnerable but unable to act. While the power is active you heal damage and recover endurance at an incredible rate. You can remain in this state for up to 30 seconds. Should you deactivate the power earlier, some of the resistance to damage and other effects will remain until the full 30 seconds window is over. Notes:If you are under the effects of No Phase, this power will instantly deactivate and leave you only with the lingering effects for 30 seconds.",
  "shortHelp": "Toggle: Self +Res(All DMG, but Psionics), +Res(Knockback, Repel, Disorient, Hold, Immobilize, Sleep), +Regen, +Recovery, Invulnerable; Self Hold",
  "icon": "icearmor_hybernate.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "endurance": 0.1085
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6
};
