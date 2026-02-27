/**
 * Defensive Adaptation
 * Toggle: Bio Armor Defensive Mode
 *
 * Source: brute_defense/bio_organic_armor/defensive_adaptation.json
 */

import type { Power } from '@/types';

export const DefensiveAdaptation: Power = {
  "name": "Defensive Adaptation",
  "internalName": "Defensive_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become dense and durable. While active Hardened Carapace grants additional resistance to Lethal, Smashing and Toxic damage, Inexhaustible grants additional Maximum HP, Environmental Modification grants additional defense and also grants a small amount of Maximum HP, Evolving Armor grants additional resistance and a small amount of defense per nearby target but loses the resistance debuff effect, Ablative Carapace grants additional damage absorption, DNA Siphon grants additional health per target hit and Parasitic Aura grants additional damage absorption per target hit. Additionally, many of your damaging attacks will heal you for a minor amount of health. However, the bulkiness of this adaptation reduces your damage moderately. Defensive Adaptation costs no endurance.Recharge: Fast.",
  "shortHelp": "Toggle: Bio Armor Defensive Mode",
  "icon": "bioorganicarmor_defensiveadaptation.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 0,
  "mechanicType": "childToggle",
  "effects": {
    "damageDebuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  },
  "requires": "Brute_Defense.Bio_Organic_Armor.Evolution"
};
