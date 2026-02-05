/**
 * Radiation Siphon
 * Melee, Superior DMG(Energy/Smash), Foe, -Def, -Contaminated, Special
 *
 * Source: dominator_assault/radioactive_assault/radiation_siphon.json
 */

import type { Power } from '@/types';

export const RadiationSiphon: Power = {
  "name": "Radiation Siphon",
  "internalName": "Radiation_Siphon",
  "available": 19,
  "description": "You pummel your foe with a deadly smashing attack dealing High Energy and Smashing damage and reducing their defense. Hitting Contaminated targets will also heal you for a large amount of health over 3 seconds and remove the Contaminated effect from the target. However, uncontaminated targets have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radioactive Assault powers cause a small burst of damage to foes near the target.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Energy/Smash), Foe, -Def, -Contaminated, Special",
  "icon": "radioactiveassault_radiationsiphon.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 10.192,
    "castTime": 2.23
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate Healing",
    "Defense Debuff",
    "Healing",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.57,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.71,
      "table": "Melee_Damage"
    },
    {
      "type": "Heal",
      "scale": 0.67,
      "table": "Melee_HealSelf",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.5,
      "table": "Melee_Debuff_Def"
    }
  }
};
