/**
 * Moon Beam
 * Sniper, Extreme DMG(Negative), Target -To Hit
 *
 * Source: dominator_assault/dark_assault/death_shroud.json
 */

import type { Power } from '@/types';

export const MoonBeam: Power = {
  "name": "Moon Beam",
  "internalName": "Death_Shroud",
  "available": 27,
  "description": "An extremely long range and accurate beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Negative), Target -To Hit",
  "icon": "darknessassault_moonbeam.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "Sniper Attacks",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
