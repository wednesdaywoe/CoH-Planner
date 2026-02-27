/**
 * Efficient Adaptation
 * Toggle: Bio Armor Efficient Mode
 *
 * Source: stalker_defense/bio_organic_armor/efficient_adaptation.json
 */

import type { Power } from '@/types';

export const EfficientAdaptation: Power = {
  "name": "Efficient Adaptation",
  "internalName": "Efficient_Adaptation",
  "available": -1,
  "description": "By activating this power you cause your Bio Armor to spontaneously mutate, causing it to become evenly distributed along your body. While active Hardened Carapace grants a minor Endurance Discount, Boundless Energy grants additional regeneration and recovery, Ablative Carapace grants a bonus to regeneration and both DNA Siphon and Parasitic Aura grant increased regeneration and recovery and Genetic Corruption grants a minor regeneration buff. Efficient Adaptation costs no endurance.Recharge: Fast.",
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
  "maxSlots": 0,
  "mechanicType": "childToggle",
  "requires": "Stalker_Defense.Bio_Organic_Armor.Adaptation"
};
