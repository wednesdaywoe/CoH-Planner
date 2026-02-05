/**
 * Seeker Drones
 * Summon Seekers: Ranged Disorient, -DMG, -ACC, -Perception, DMG(Energy)
 *
 * Source: defender_buff/traps/seeker_drones.json
 */

import type { Power } from '@/types';

export const SeekerDrones: Power = {
  "name": "Seeker Drones",
  "internalName": "Seeker_Drones",
  "available": 17,
  "description": "You create two Seeker Drones. These Seeker Drones will follow you until they detect an enemy and then they will zero in on their targets and detonate on impact. The small explosive flash of energy does only minor damage, but the concussion can weaken foes. Affected targets will have reduced Damage, Accuracy and Perception and may even be Disoriented for a short while. You can only ever have Two Seeker Drones out at one time and they can be destroyed by your foes.",
  "shortHelp": "Summon Seekers: Ranged Disorient, -DMG, -ACC, -Perception, DMG(Energy)",
  "icon": "traps_droppedaoedebuffdamage.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Defender Archetype Sets",
    "Pet Damage",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Seeker2_Defender",
      "duration": 240
    }
  }
};
