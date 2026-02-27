/**
 * Hardened Carapace
 * Self Toggle, +Res(Lethal, Smash, Toxic, Disorient, Sleep), +Special
 *
 * Source: stalker_defense/bio_organic_armor/hardened_carapace.json
 */

import type { Power } from '@/types';

export const HardenedCarapace: Power = {
  "name": "Hardened Carapace",
  "internalName": "Hardened_Carapace",
  "available": 0,
  "description": "With a little concentration you can cause your skin to become hard as stone, boosting your constitution to reject toxins and recovering from wounds more quickly. While active, this power will boost your resistance to Lethal, Smashing and Toxic damage, grant a minor amount of regeneration, and protection from Disorient and Sleep effects. If Efficient Adaptation is active, Hardened Carapace will grant an Endurance Discount. If Defensive Adaptation is active, Hardened Carapace will grant additional resistance to Lethal, Smashing and Toxic damage. While Offensive Adaptation is active, this power will grant a minor boost to damage. Bonuses granted from Adaptations are unenhanceable.Recharge: Very Fast.",
  "shortHelp": "Self Toggle, +Res(Lethal, Smash, Toxic, Disorient, Sleep), +Special",
  "icon": "bioorganicarmor_hardenedskin.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 2,
    "endurance": 0.13,
    "castTime": 0.67
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 0.75,
        "table": "Melee_Res_Dmg"
      }
    },
    "damageBuff": {
      "scale": 2.5,
      "table": "Melee_Buff_Dmg"
    },
    "enduranceDiscount": {
      "scale": 0.25,
      "table": "Melee_Stun"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
