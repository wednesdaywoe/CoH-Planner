/**
 * Sniper Rifle
 * Sniper, DMG(Lethal), Foe Knockback
 *
 * Source: dominator_assault/arsenal_assault/sniper_rifle.json
 */

import type { Power } from '@/types';

export const SniperRifle: Power = {
  "name": "Sniper Rifle",
  "internalName": "Sniper_Rifle",
  "available": 27,
  "description": "Sniper Rifle is a powerful piece of hardware. It is very accurate and has a very long range. The impressive round can knock down its target. Like most sniper attacks, you must take your time to aim, so this attack can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Lethal), Foe Knockback",
  "icon": "assaultweapons_sniperrifle.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 150,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
