/**
 * Irradiated Ground
 * Toggle, DoT(Toxic) Patch, Foe -Def, Special
 *
 * Source: brute_melee/radiation_melee/irradiated_ground.json
 */

import type { Power } from '@/types';

export const IrradiatedGround: Power = {
  "name": "Irradiated Ground",
  "internalName": "Irradiated_Ground",
  "available": 17,
  "description": "While active you will scorch the earth beneath you leaving toxic clouds of radioactive gas in your wake. Foes that enter these clouds will suffer Minor Toxic damage, have their defense reduced and also have a tiny chance of being Contaminated. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "Toggle, DoT(Toxic) Patch, Foe -Def, Special",
  "icon": "radiationmelee_irradiatedground.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 2.6,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
