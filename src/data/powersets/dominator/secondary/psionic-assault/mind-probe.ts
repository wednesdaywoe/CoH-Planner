/**
 * Mind Probe
 * Melee, High DMG(Psionic), Target -Recharge
 *
 * Source: dominator_assault/psionic_assault/mind_probe.json
 */

import type { Power } from '@/types';

export const MindProbe: Power = {
  "name": "Mind Probe",
  "internalName": "Mind_Probe",
  "available": 0,
  "description": "Grip the minds of your foe with a Mind Probe. You must be in close proximity to pull off this attack that wrecks havoc on your foes synapses, dealing high Psionic Damage while reducing their attack speed.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Psionic), Target -Recharge",
  "icon": "psionicassault_mindprobe.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.96,
    "table": "Melee_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    }
  }
};
