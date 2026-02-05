/**
 * Efficient Adaptation
 * Toggle: Bio Armor Efficient Mode
 *
 * Source: scrapper_defense/bio_organic_armor/efficient_adaptation.json
 */

import type { Power } from '@/types';

export const EfficientAdaptation: Power = {
  "name": "Efficient Adaptation",
  "internalName": "Efficient_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become evenly distributed along your body. While active Hardened Carapace grants a minor Endurance Discount, Inexhaustible grants additional regeneration and recovery, Ablative Carapace grants a bonus to regeneration, Evolving Armor grants additional regeneration and recovery for nearby targets, and both DNA Siphon and Parasitic Aura grant increased regeneration and recovery. Efficient Adaptation costs no endurance.Recharge: Fast.",
  "shortHelp": "Toggle: Bio Armor Efficient Mode",
  "icon": "bioorganicarmor_efficientadaptation.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "castTime": 0.67
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "requires": "Scrapper_Defense.Bio_Organic_Armor.Evolution"
};
