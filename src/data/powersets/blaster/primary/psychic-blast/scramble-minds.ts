/**
 * Scramble Minds
 * Chain, DMG(Psionic), Foe Disorient
 *
 * Source: blaster_ranged/psychic_blast/scramble_thoughts.json
 */

import type { Power } from '@/types';

export const ScrambleMinds: Power = {
  "name": "Scramble Minds",
  "internalName": "Scramble_Thoughts",
  "available": 21,
  "description": "Painfully scrambles the synapses of a targeted foe, leaving them dramatically Disoriented for a short duration. The effects of this power can jump from one foe to another in a chain dealing damage and applying a random mental effects to each target.",
  "shortHelp": "Chain, DMG(Psionic), Foe Disorient",
  "icon": "psychicblast_scrambleminds.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "radius": 15,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2,
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
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  }
};
