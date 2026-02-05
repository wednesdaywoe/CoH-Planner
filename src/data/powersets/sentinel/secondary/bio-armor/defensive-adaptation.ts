/**
 * Defensive Adaptation
 * Toggle: Bio Armor Defensive Mode
 *
 * Source: sentinel_defense/bio_organic_armor/defensive_adaptation.json
 */

import type { Power } from '@/types';

export const DefensiveAdaptation: Power = {
  "name": "Defensive Adaptation",
  "internalName": "Defensive_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become dense and durable. While active Hardened Carapace grants additional resistance to Lethal, Smashing and Toxic damage, Inexhaustible grants additional Maximum HP, Environmental Adaptation grants additional defense and a small amount of Maximum HP, Ablative Carapace grants additional damage absorption, Rebuild DNA restores additional health, Athletic Regulation will make you more resistant to run and fly speed debuffs, Genomic Evolution will grant a small amount of additional damage resistance, Parasitic Leech grants additional damage absorption and increases the effectiveness of it's damage debuff. Additionally, many of your damaging attacks will heal you for a minor amount of health. However, the bulkiness of this adaptation reduces your damage moderately.Defensive Adaptation costs no endurance.",
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
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  },
  "requires": "Sentinel_Defense.Bio_Organic_Armor.Adaptation"
};
