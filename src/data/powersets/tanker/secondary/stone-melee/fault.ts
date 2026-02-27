/**
 * Fault
 * Close (Targeted AoE), DMG(Smashing), Foe Knockback, Disorient
 *
 * Source: tanker_melee/stone_melee/fault.json
 */

import type { Power } from '@/types';

export const Fault: Power = {
  "name": "Fault",
  "internalName": "Fault",
  "available": 19,
  "description": "This powerful stomp can cause a seismic disturbance. This will crack the Earth itself and send a Fault towards a targeted foe, throwing him and nearby enemies into the air and possibly Disorienting them. Fault has a chance of dealing damage to foes in between you and your target.Notes: Thanks to gauntlet, this power's disorient effect can hit up to 6 targets above its 10 target cap at 1/3rd effectiveness.",
  "shortHelp": "Close (Targeted AoE), DMG(Smashing), Foe Knockback, Disorient",
  "icon": "stonemelee_fault.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 0.8,
    "range": 20,
    "recharge": 20,
    "endurance": 10.192,
    "castTime": 2.1
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Stuns",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
