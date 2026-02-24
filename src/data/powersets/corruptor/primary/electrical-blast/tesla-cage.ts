/**
 * Tesla Cage
 * Ranged, DMG(Energy), Foe Hold, -End
 *
 * Source: corruptor_ranged/electrical_blast/tesla_cage.json
 */

import type { Power } from '@/types';

export const TeslaCage: Power = {
  "name": "Tesla Cage",
  "internalName": "Tesla_Cage",
  "available": 17,
  "description": "Tesla Cage confines the target in an electrical prison. The target is overwhelmed by the electrical charge and is left helpless and can be attacked. The target is drained of some Endurance and some of that Endurance may be transferred back to you.Taking this power allows you to build Static with each activation of other electrical blast attacks. As Static builds, you can unleash it with Tesla Cage as electricity will jump off your main target and shock others nearby!",
  "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
  "icon": "electricalbolt_telsacage.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 10,
    "recharge": 10,
    "endurance": 6.864,
    "castTime": 2.17,
    "maxTargets": 1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Endurance Modification",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_EndDrain"
    },
    "enduranceGain": {
      "scale": 3.43,
      "table": "Ranged_EndDrain"
    },
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Ones"
    }
  }
};
