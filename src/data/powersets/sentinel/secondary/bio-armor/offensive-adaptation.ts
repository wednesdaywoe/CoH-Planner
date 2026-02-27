/**
 * Offensive Adaptation
 * Toggle: Bio Armor Offensive Mode
 *
 * Source: sentinel_defense/bio_organic_armor/offensive_adaptation.json
 */

import type { Power } from '@/types';

export const OffensiveAdaptation: Power = {
  "name": "Offensive Adaptation",
  "internalName": "Offensive_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to sprout spines and become much lighter. While active Hardened Carapace increases your damage slightly, Environmental Adaptation grants you a moderate to hit buff, Athletic Regulation will increase your run and flight speeds, Genomic Evolution grants a small range buff, and the regeneration debuff from Parasitic Leech will be increased. Additionally, many of your damaging powers will inflict a minor amount of additional Toxic damage. While Offensive Adaptation is active your Defense and Damage Resistance is reduced slightly.Offensive Adaptation costs no endurance.",
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
  "requires": "Sentinel_Defense.Bio_Organic_Armor.Adaptation"
};
