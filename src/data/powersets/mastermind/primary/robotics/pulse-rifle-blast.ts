/**
 * Pulse Rifle Blast
 * Ranged, DMG(Energy), -Regen
 *
 * Source: mastermind_summon/robotics/pulse_rifle_blast.json
 */

import type { Power } from '@/types';

export const PulseRifleBlast: Power = {
  "name": "Pulse Rifle Blast",
  "internalName": "Pulse_Rifle_Blast",
  "available": 0,
  "description": "This Pulse Rifle can fire a long range laser pulse that deals Energy damage.Laser Burn:Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
  "shortHelp": "Ranged, DMG(Energy), -Regen",
  "icon": "robotics_laserrifleburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "regenDebuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    }
  }
};
