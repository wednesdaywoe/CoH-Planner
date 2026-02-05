/**
 * Lightning Bolt
 * Ranged, DMG(Energy), Foe -End
 *
 * Source: sentinel_ranged/electrical_blast/lightning_bolt.json
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
    "range": 60,
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
    "Endurance Modification",
    "Ranged Damage",
    "Sentinel Archetype Sets",
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
    }
  }
};
