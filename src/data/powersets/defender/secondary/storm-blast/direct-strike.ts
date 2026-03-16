/**
 * Direct Strike
 * Sniper, DMG(Energy), Foe -End, Special
 *
 * Source: defender_ranged/storm_blast/direct_strike.json
 */

import type { Power } from '@/types';

export const DirectStrike: Power = {
  "name": "Direct Strike",
  "internalName": "Direct_Strike",
  "available": 19,
  "description": "You channel your storm powers into a direct hit, jolting the enemy with a bolt of lightning that deals Energy damage and saps some endurance. If fired outside of combat, it can be interrupted by enemies, but will do bonus damage. If you are engaged in battle, this attack becomes instant-cast. While in a Storm Cell, targets have a chance to be stunned. The odds of creating High Winds and Lightning are much greater when Direct Strike is cast out of combat.",
  "shortHelp": "Sniper, DMG(Energy), Foe -End, Special",
  "icon": "stormblast_directstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 3.33
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 4.5,
    "table": "Ranged_Damage"
  },
  "quickSnipe": {
    "stats": {
      "castTime": 1.33,
      "range": 80
    },
    "damage": {
      "type": "Energy",
      "scale": 2.28,
      "table": "Ranged_Damage"
    }
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.2,
      "table": "Ranged_EndDrain"
    },
    "stun": {
      "mag": 4,
      "scale": 2,
      "table": "Ranged_Stun"
    },
    "rangeBuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "durations": {
      "rangeBuff": 10
    },
    "buffDuration": 10
  }
};
