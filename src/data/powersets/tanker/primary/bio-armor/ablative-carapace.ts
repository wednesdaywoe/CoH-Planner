/**
 * Ablative Carapace
 * Self, +Absorption, +Regeneration
 *
 * Source: tanker_defense/bio_organic_armor/ablative_carapace.json
 */

import type { Power } from '@/types';

export const AblativeCarapace: Power = {
  "name": "Ablative Carapace",
  "internalName": "Ablative_Carapace",
  "available": 7,
  "description": "When needed, you're able to cause your Bio Armor to gain a thick, but brittle outer layer that will absorb a large amount of damage before breaking off. Ablative Carapace will grant a moderate amount of damage absorption and a high amount of regeneration for a short time. While Efficient Adaptation is active, this power grants a slightly larger regeneration buff. While Defensive Adaptation is active, this power grants a bonus to damage absorption.Recharge: Long.",
  "shortHelp": "Self, +Absorption, +Regeneration",
  "icon": "bioorganicarmor_ablativecarapace.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.3,
      "table": "Melee_Ones"
    }
  }
};
