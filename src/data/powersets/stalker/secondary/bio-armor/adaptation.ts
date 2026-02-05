/**
 * Adaptation
 * Gain Efficient, Defensive and Offensive Adaptations
 *
 * Source: stalker_defense/bio_organic_armor/adaptation.json
 */

import type { Power } from '@/types';

export const Adaptation: Power = {
  "name": "Adaptation",
  "internalName": "Adaptation",
  "available": 9,
  "description": "By purchasing this power you gain access to three mutually exclusive toggle powers: Efficient Adaptation, Defensive Adaptation and Offensive Adaptation. If Defensive Adaptation is active you gain improved damage resistance from Hardened Carapace and Genetic Corruption, additional defense from Environmental Modification, and increased Maximum HP from Environmental Modification and Boundless Energy. If Offensive Adaptation is active you gain bonus damage from Hardened Carapace, additional To Hit from Environmental Modification, empowered debuff effects from DNA Siphon, and Parasitic Aura and increased sleep chance from Genetic Corruption. While Efficient Adaptation is active Hardened Carapace will provide a moderate endurance discount, Boundless Energy has increased Regeneration and Recovery, Genetic Corruption grants additional regeneration, DNA Siphon grants additional regeneration and recovery for each defeated target and Parasitic Aura grants additional regeneration and recovery for each nearby target.",
  "shortHelp": "Gain Efficient, Defensive and Offensive Adaptations",
  "icon": "bioorganicarmor_adaptation.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6
};
