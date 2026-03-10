/**
 * Keening Winds
 * Ranged (Targeted AoE), Confuse(Foe), EndDrain(Foe), +End(Self)
 *
 * Source: controller_control/wind_control/keening_winds.json
 */

import type { Power } from '@/types';

export const KeeningWinds: Power = {
  "name": "Keening Winds",
  "internalName": "Keening_Winds",
  "available": 17,
  "description": "You create a sphere of variable speed winds that generate strong friction within the turbulence of the air. This creates odd echoes and sounds that confuse foes caught within the burst. The loss of confidence your foes suffer due their confusion causes them to lose endurance over a few seconds, while you gain endurance due to a boost in confidence you enjoy from seeing your foes struggle. This power builds Pressure.Damage: None.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Confuse(Foe), EndDrain(Foe), +End(Self)",
  "icon": "windcontrol_keeningwinds.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "radius": 15,
    "recharge": 120,
    "endurance": 10.4,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Confuse",
    "Controller Archetype Sets",
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "effects": {
    "confuse": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Fear"
    },
    "enduranceDrain": {
      "scale": 0.04,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 10,
      "table": "Ranged_EndDrain"
    }
  },
  "requires": "char>accesslevel >= 0"
};
