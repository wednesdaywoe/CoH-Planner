/**
 * Lightning Bolt
 * Ranged, DMG(Energy), Foe -End
 *
 * Source: defender_ranged/electrical_blast/lightning_bolt.json
 */

import type { Power } from '@/types';

export const LightningBolt: Power = {
  "name": "Lightning Bolt",
  "internalName": "Lightning_Bolt",
  "available": 0,
  "description": "You can send a large blast of electrical energy at a foe, dealing heavy damage and draining some Endurance. Some of this Endurance may transfer back to you. Lightning Bolt deals more damage than Charged Bolts, but recharges more slowly.",
  "shortHelp": "Ranged, DMG(Energy), Foe -End",
  "icon": "electricalbolt_lightningbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
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
    "Endurance Modification",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Ranged_EndDrain"
    },
    "enduranceGain": {
      "scale": 4.265,
      "table": "Ranged_EndDrain"
    },
    "recoveryDebuff": {
      "scale": 0.4,
      "table": "Ranged_EndDrain"
    }
  }
};
