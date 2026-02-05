/**
 * Scramble Thoughts
 * Ranged, Extreme DMG(Psionic), Foe Disorient
 *
 * Source: sentinel_ranged/psychic_blast/scramble_thoughts.json
 */

import type { Power } from '@/types';

export const ScrambleThoughts: Power = {
  "name": "Scramble Thoughts",
  "internalName": "Scramble_Thoughts",
  "available": 21,
  "description": "Painfully scrambles the synapses of a targeted foe, leaving them dramatically Disoriented for a short duration. Deals a little Psionic Damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Ranged, Extreme DMG(Psionic), Foe Disorient",
  "icon": "psychicblast_scramblethoughts.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 75,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 3
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 3.56,
    "table": "Ranged_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
