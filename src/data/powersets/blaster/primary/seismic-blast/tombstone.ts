/**
 * Tombstone
 * Sniper, DMG(Smash), Foe -Jump, -Fly
 *
 * Source: blaster_ranged/seismic_blast/tombstone.json
 */

import type { Power } from '@/types';

export const Tombstone: Power = {
  "name": "Tombstone",
  "internalName": "Tombstone",
  "available": 17,
  "description": "Create a giant pillar of stone, creating a Tombstone around your target, dealing extreme damage and limiting their ability to jump and fly for a short time. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle, this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Tombstone grants two stacks of Seismic Pressure.",
  "shortHelp": "Sniper, DMG(Smash), Foe -Jump, -Fly",
  "icon": "seismicblast_snipe.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.67
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
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
