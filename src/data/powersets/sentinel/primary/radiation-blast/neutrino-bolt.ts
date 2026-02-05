/**
 * Neutrino Bolt
 * Ranged, DMG(Energy), Foe -DEF
 *
 * Source: sentinel_ranged/radiation_blast/neutrino_bolt.json
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
    "range": 60,
    "recharge": 4,
    "endurance": 5.2,
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
    "Defense Debuff",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
