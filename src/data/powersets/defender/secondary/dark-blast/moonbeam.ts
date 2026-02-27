/**
 * Moonbeam
 * Sniper, DMG(Negative), Target -To Hit
 *
 * Source: defender_ranged/dark_blast/moonbeam.json
 */

import type { Power } from '@/types';

export const Moonbeam: Power = {
  "name": "Moonbeam",
  "internalName": "Moonbeam",
  "available": 3,
  "description": "An extremely long range and accurate beam of Negative Energy that deals tremendous damage and reduces the target's chance to hit. This is a sniper attack, and like most sniper attacks, is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Negative), Target -To Hit",
  "icon": "darkcast_moonbeam.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
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
    "Defender Archetype Sets",
    "Ranged Damage",
    "Sniper Attacks",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
