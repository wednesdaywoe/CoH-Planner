/**
 * Zapping Bolt
 * Ranged, DMG(Energy), Foe -End
 *
 * Source: sentinel_ranged/electrical_blast/zapping_bolt.json
 */

import type { Power } from '@/types';

export const ZappingBolt: Power = {
  "name": "Zapping Bolt",
  "internalName": "Zapping_Bolt",
  "available": 5,
  "description": "A focused electrical blast that can be fired off at a quick speed with high Accuracy. Zapping Bolt drains Endurance.",
  "shortHelp": "Ranged, DMG(Energy), Foe -End",
  "icon": "electricalbolt_heavy.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1
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
    "scale": 1.96,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.15,
      "table": "Ranged_EndDrain"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 7.2,
      "table": "Ranged_Ones"
    }
  }
};
