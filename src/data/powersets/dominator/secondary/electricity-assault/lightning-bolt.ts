/**
 * Lightning Bolt
 * Ranged, Moderate DMG(Energy), Foe -End
 *
 * Source: dominator_assault/electricity_manipulation/lightning_field.json
 */

import type { Power } from '@/types';

export const LightningBolt: Power = {
  "name": "Lightning Bolt",
  "internalName": "Lightning_Field",
  "available": 3,
  "description": "You can send a large blast of electrical energy at a foe, dealing high damage and draining some Endurance. Some of this Endurance may transfer back to you. Lightning Bolt deals more damage than Charged Bolts, but recharges more slowly.Damage: Moderate.Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Energy), Foe -End",
  "icon": "electricalassault_lightningbolt.png",
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
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
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
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 4.265,
      "table": "Ranged_Ones"
    }
  }
};
