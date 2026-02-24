/**
 * Jet Stream
 * Ranged (Cone), DMG(Smashing), Foe Knockdown or Repel
 *
 * Source: blaster_ranged/storm_blast/jet_stream.json
 */

import type { Power } from '@/types';

export const JetStream: Power = {
  "name": "Jet Stream",
  "internalName": "Jet_Stream",
  "available": 1,
  "description": "You call forth a cone of rapidly moving air that repels enemies, causing Smashing damage. Enemies who are within a Storm Cell will not be repelled, but instead will be knocked down.",
  "shortHelp": "Ranged (Cone), DMG(Smashing), Foe Knockdown or Repel",
  "icon": "stormblast_jetstream.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 50,
    "arc": 0.5236,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.8,
    "table": "Ranged_Damage"
  },
  "effects": {
    "repel": {
      "scale": 4,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
