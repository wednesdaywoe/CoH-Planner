/**
 * Rebuild DNA
 * Self +HP, +End, +Special
 *
 * Source: sentinel_defense/bio_organic_armor/rebuild_dna.json
 */

import type { Power } from '@/types';

export const RebuildDNA: Power = {
  "name": "Rebuild DNA",
  "internalName": "Rebuild_DNA",
  "available": 19,
  "description": "You rebuild your genetic makeup to restore some of your health and endurance.*While Offensive Adaptation is active, this power's will increase your perception.*While Defensive Adaptation is active, this power will grant bonus health.*While Efficient Adaptation is active, this power will grant bonus endurance.Bonuses granted from Adaptations are unenhanceable.",
  "shortHelp": "Self +HP, +End, +Special",
  "icon": "bioorganicarmor_rebuilddna.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    {
      "type": "Heal",
      "scale": 0.9,
      "table": "Melee_HealSelf"
    }
  ],
  "effects": {
    "enduranceGain": {
      "scale": 7.5,
      "table": "Melee_Ones"
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    }
  }
};
