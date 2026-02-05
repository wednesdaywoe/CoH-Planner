/**
 * Suppressive Fire
 * Ranged, DMG(Lethal/Special), Foe Disorient/Special
 *
 * Source: sentinel_ranged/dual_pistols/suppressive_fire.json
 */

import type { Power } from '@/types';

export const SuppressiveFire: Power = {
  "name": "Suppressive Fire",
  "internalName": "Suppressive_Fire",
  "available": 5,
  "description": "Suppressive Fire allows the user to quickly stun their target for a short time and deal a very minor amount of Lethal damage.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will lower the power's base recharge to 8 seconds and change the secondary effect of this attack from Disorient effect to a Hold effect if 'Cryo Ammo', 'Incendiary Ammo' or 'Chemical Ammo' are loaded.*Significantly higher damage and boss-stopping hold if 'Cryo Ammo' is loaded.*Significantly higher damage and minor hold if 'Incendiary Ammo' is loaded.*Somewhat increased damage and long duration hold if 'Chemical Ammo' is loaded.",
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
    "Holds",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
