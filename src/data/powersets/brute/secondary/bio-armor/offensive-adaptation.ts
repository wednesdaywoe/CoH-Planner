/**
 * Offensive Adaptation
 * Toggle: Bio Armor Offensive Mode
 *
 * Source: brute_defense/bio_organic_armor/offensive_adaptation.json
 */

import type { Power } from '@/types';

export const OffensiveAdaptation: Power = {
  "name": "Offensive Adaptation",
  "internalName": "Offensive_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to sprout spines and become much lighter. While active Hardened Carapace increases your damage slightly, Environmental Modification grants you a moderate to hit buff, Evolving Armor has an improved Damage Resistance debuff, and debuff effects from DNA Siphon, Genetic Contamination and Parasitic Aura are increased moderately. Additionally, many of your damaging powers will inflict a minor amount of additional Toxic damage. While Offensive Adaptation is active your Defense and Damage Resistance is reduced slightly. Offensive Adaptation costs no endurance.Recharge: Fast.",
  "shortHelp": "Toggle: Bio Armor Offensive Mode",
  "icon": "bioorganicarmor_offensiveadaptation.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.67
  },
  "allowedEnhancements": [],
  "maxSlots": 0,
  "mechanicType": "childToggle",
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "lethal": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "fire": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "cold": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "energy": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "negative": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "psionic": {
        "scale": 0.075,
        "table": "Melee_Ones"
      },
      "toxic": {
        "scale": 0.075,
        "table": "Melee_Ones"
      }
    }
  },
  "requires": "Brute_Defense.Bio_Organic_Armor.Evolution"
};
