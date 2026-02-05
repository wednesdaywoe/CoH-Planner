/**
 * Suppressive Fire
 * Ranged, DMG(Lethal/Special), Foe Disorient/Special
 *
 * Source: defender_ranged/dual_pistols/suppressive_fire.json
 */

import type { Power } from '@/types';

export const SuppressiveFire: Power = {
  "name": "Suppressive Fire",
  "internalName": "Suppressive_Fire",
  "available": 19,
  "description": "Suppressive Fire allows the user to quickly stun their target for a short time and deal a very minor amount of Lethal damage.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from Disorient effect to a Hold effect if 'Cryo Ammo', 'Incendiary Ammo' or 'Chemical Ammo' are loaded. Damage and duration of the hold will variate by ammo type.",
  "shortHelp": "Ranged, DMG(Lethal/Special), Foe Disorient/Special",
  "icon": "dualpistols_suppressivefire.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 60,
    "recharge": 20,
    "endurance": 10.192,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
