/**
 * Water Jet
 * Ranged, DMG(Cold/Smash), Foe -Speed, +Wet, Self +/-Tidal Power
 *
 * Source: defender_ranged/water_blast/water_jet.json
 */

import type { Power } from '@/types';

export const WaterJet: Power = {
  "name": "Water Jet",
  "internalName": "Water_Jet",
  "available": 23,
  "description": "You spray a concentrated torrent of water toward your target that causes Cold and Smashing damage as well as reducing your target's movement speed. If you have 2 or less Tidal Power, you will gain a stack of Tidal Power. If you have 3 Tidal Power and you activate this power, it will have an enhanced effect causing Water Jet to cast slightly faster and immediately reset the recharge of Water Jet. Water Jet's enhanced effect can be used once every 8 seconds.",
  "shortHelp": "Ranged, DMG(Cold/Smash), Foe -Speed, +Wet, Self +/-Tidal Power",
  "icon": "waterblast_waterjet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.43
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
