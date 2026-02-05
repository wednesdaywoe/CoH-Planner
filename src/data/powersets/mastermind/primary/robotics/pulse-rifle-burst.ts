/**
 * Pulse Rifle Burst
 * Ranged, DMG(Energy), Foe Knockback, -Regen
 *
 * Source: mastermind_summon/robotics/pulse_rifle_burst.json
 */

import type { Power } from '@/types';

export const PulseRifleBurst: Power = {
  "name": "Pulse Rifle Burst",
  "internalName": "Pulse_Rifle_Burst",
  "available": 1,
  "description": "This high powered laser pulse from your Pulse Rifle takes more energy to fire, but causes much more damage than a standard pulse and has a very good chance to send your foes flying.Laser Burn:Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
  "shortHelp": "Ranged, DMG(Energy), Foe Knockback, -Regen",
  "icon": "robotics_laserrifleblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 10.66,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
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
    "regenDebuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    }
  }
};
