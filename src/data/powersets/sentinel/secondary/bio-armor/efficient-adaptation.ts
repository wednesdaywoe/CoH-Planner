/**
 * Efficient Adaptation
 * Toggle: Bio Armor Efficient Mode
 *
 * Source: sentinel_defense/bio_organic_armor/efficient_adaptation.json
 */

import type { Power } from '@/types';

export const EfficientAdaptation: Power = {
  "name": "Efficient Adaptation",
  "internalName": "Efficient_Adaptation",
  "available": -1,
  "description": "Efficient AdaptationBy activating this power you cause your Bio Armor to spontaneously mutate, causing it to become evenly distributed along your body. While active Hardened Carapace grants a minor Endurance Discount, Inexhaustible and Parasitic Leech will grant additional regeneration and recovery, Ablative Carapace grants a bonus to regeneration, Rebuild DNA grants a massive bonus to recovery, Athletic Regulation will increase your run and flight speeds, and Genomic Evolution will increase your maximum endurance.Efficient Adaptation costs no endurance.",
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
  "requires": "Sentinel_Defense.Bio_Organic_Armor.Adaptation"
};
