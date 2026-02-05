/**
 * Neutrino Bolt
 * Ranged, DMG(Energy), Foe -DEF
 *
 * Source: defender_ranged/radiation_blast/neutrino_bolt.json
 */

import type { Power } from '@/types';

export const NeutrinoBolt: Power = {
  "name": "Neutrino Bolt",
  "internalName": "Neutrino_Bolt",
  "available": 0,
  "description": "A very quick, but low damage attack. Neutrino Bolt can reduce the target's Defense.",
  "shortHelp": "Ranged, DMG(Energy), Foe -DEF",
  "icon": "radiationburst_neutrinoblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.6,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
