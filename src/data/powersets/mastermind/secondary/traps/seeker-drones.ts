/**
 * Seeker Drones
 * Summon Seekers: Ranged Disorient, -DMG, -To Hit, -Perception, Low DMG(Energy)
 *
 * Source: mastermind_buff/traps/seeker_drones.json
 */

import type { Power } from '@/types';

export const SeekerDrones: Power = {
  "name": "Seeker Drones",
  "internalName": "Seeker_Drones",
  "available": 23,
  "description": "You create two Seeker Drones. These Seeker Drones will follow you until they detect an enemy and then they will zero in on their targets and detonate on impact. The small explosive flash of energy does only minor damage, but the concussion can weaken foes. Affected targets will have reduced Damage, chance to hit and Perception and may even be Disoriented for a short while. You can only ever have Two Seeker Drones out at one time and they can be destroyed by your foes.Recharge: Long.",
  "shortHelp": "Summon Seekers: Ranged Disorient, -DMG, -To Hit, -Perception, Low DMG(Energy)",
  "icon": "traps_droppedaoedebuffdamage.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 90,
    "endurance": 19.5,
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
    "Pet Damage",
    "Ranged AoE Damage",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets",
    "Mastermind Archetype Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Seeker2",
      "duration": 240
    }
  }
};
