/**
 * Sniper Rifle
 * Sniper, DMG(Lethal), Foe Knockback
 *
 * Source: defender_ranged/assault_rifle/sniper_rifle.json
 */

import type { Power } from '@/types';

export const SniperRifle: Power = {
  "name": "Sniper Rifle",
  "internalName": "Sniper_Rifle",
  "available": 19,
  "description": "Sniper Rifle is a powerful piece of hardware. It is very accurate and has a very long range. The impressive round can knock down its target. Like most sniper attacks, you must take your time to aim, so this attack can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Lethal), Foe Knockback",
  "icon": "assaultweapons_sniperrifle.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
