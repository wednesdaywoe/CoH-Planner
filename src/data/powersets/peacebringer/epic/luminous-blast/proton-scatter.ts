/**
 * Proton Scatter
 * Ranged (Cone), Light DMG(Energy), Foe -DEF
 *
 * Source: peacebringer_offensive/luminous_blast/proton_scatter.json
 */

import type { Power } from '@/types';

export const ProtonScatter: Power = {
  "name": "Proton Scatter",
  "available": 7,
  "description": "Proton Scatter sends bolts of Kheldian energy to multiple targets at once within a cone area in front of the caster. Proton Scatter deals moderate Energy damage to each affected target and reduces their Defense.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Energy), Foe -DEF",
  "icon": "luminousblast_protonscatter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
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
    "Kheldian Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.17,
    "radius": 40,
    "arc": 0.7854,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 0.99,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
