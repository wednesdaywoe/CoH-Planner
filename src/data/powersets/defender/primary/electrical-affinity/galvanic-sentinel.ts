/**
 * Galvanic Sentinel
 * Summon Galvanic Sentinel: Ranged Debuff Special
 *
 * Source: defender_buff/shock_therapy/discharge.json
 */

import type { Power } from '@/types';

export const GalvanicSentinel: Power = {
  "name": "Galvanic Sentinel",
  "internalName": "Discharge",
  "available": 1,
  "description": "Summons a Galvanic Sentinel to your aid. The Galvanic Sentinel shocks and weakens your foes, draining some endurance and reducing their regeneration, recovery, and damage output. The Galvanic Sentinel can be buffed and healed, and may be targeted with your Circuit powers.Recharge: Slow.",
  "shortHelp": "Summon Galvanic Sentinel: Ranged Debuff Special",
  "icon": "shocktherapy_galvanicsentinel.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 60,
    "endurance": 25,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_GalvanicSentinel",
      "duration": 120
    }
  }
};
