/**
 * Short Circuit
 * PBAoE, DoT(Energy), Foe -End, -Recovery
 *
 * Source: blaster_ranged/electrical_blast/short_circuit.json
 */

import type { Power } from '@/types';

export const ShortCircuit: Power = {
  "name": "Short Circuit",
  "internalName": "Short_Circuit",
  "available": 5,
  "description": "Releases a burst of electrical energy around you, shocking all nearby foes. This highly accurate discharge deals Moderate damage over time, drains a lot of Endurance from the targets and renders them unable to recover Endurance for quite a while. Additionally, Short Circuit deals extra damage to most robots and mechanical foes. Short Circuit is very effective when used with your other Endurance draining powers.",
  "shortHelp": "PBAoE, DoT(Energy), Foe -End, -Recovery",
  "icon": "electricalbolt_shortcircuit.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.3,
    "radius": 20,
    "recharge": 20,
    "endurance": 15.6,
    "castTime": 2.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.18,
    "table": "Ranged_Damage",
    "duration": 1.5,
    "tickRate": 0.35
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.35,
      "table": "Ranged_EndDrain"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_EndDrain"
    }
  }
};
