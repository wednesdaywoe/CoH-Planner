/**
 * Lightning Strike
 * Ranged, DMG(Energy), Foe -End, Special
 *
 * Source: sentinel_ranged/storm_blast/lightning_strike.json
 */

import type { Power } from '@/types';

export const LightningStrike: Power = {
  "name": "Lightning Strike",
  "internalName": "Lightning_Strike",
  "available": 11,
  "description": "You channel your storm powers into a direct hit, jolting the enemy with a bolt of lightning that deals Energy damage and saps some endurance.While in a Storm Cell, targets have a chance to be stunned.",
  "shortHelp": "Ranged, DMG(Energy), Foe -End, Special",
  "icon": "stormblast_lightningstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 2.28,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_EndDrain"
    },
    "stun": {
      "mag": 3,
      "scale": 2,
      "table": "Ranged_Stun"
    }
  }
};
