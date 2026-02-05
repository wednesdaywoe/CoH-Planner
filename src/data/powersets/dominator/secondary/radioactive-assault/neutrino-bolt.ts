/**
 * Neutrino Bolt
 * Ranged, Light DMG(Energy), Foe -DEF
 *
 * Source: dominator_assault/radioactive_assault/neutrino_bolt.json
 */

import type { Power } from '@/types';

export const NeutrinoBolt: Power = {
  "name": "Neutrino Bolt",
  "internalName": "Neutrino_Bolt",
  "available": 0,
  "description": "A very quick, but low damage attack. Neutrino Bolt can reduce the target's Defense. Affected enemies have a small chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Energy), Foe -DEF",
  "icon": "radioactiveassault_neutrinoblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
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
