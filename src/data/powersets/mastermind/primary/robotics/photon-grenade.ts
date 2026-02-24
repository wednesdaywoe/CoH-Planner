/**
 * Photon Grenade
 * Ranged (Targeted AoE), DMG(Energy), Disorient, -Regen
 *
 * Source: mastermind_summon/robotics/photon_grenade.json
 */

import type { Power } from '@/types';

export const PhotonGrenade: Power = {
  "name": "Photon Grenade",
  "internalName": "Photon_Grenade",
  "available": 7,
  "description": "Launches an Energy Grenade at long range from your Pulse Rifle. The energy from this explosion can Disorient some targets in the affected area and debuffs their regeneration.Laser Burn:Targets struck by this attack will have their Regeneration debuffed for 30 seconds.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Disorient, -Regen",
  "icon": "robotics_laserriflestungrenade.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 18.98,
    "castTime": 1.87,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.8985,
    "table": "Ranged_Damage"
  },
  "effects": {
    "regenDebuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    },
    "stun": {
      "mag": 2,
      "scale": 4,
      "table": "Ranged_Stun"
    }
  }
};
