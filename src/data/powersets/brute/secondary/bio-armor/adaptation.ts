/**
 * Adaptation
 * Gain Efficient, Defensive and Offensive Adaptations
 *
 * Source: brute_defense/bio_organic_armor/evolution.json
 */

import type { Power } from '@/types';

export const Adaptation: Power = {
  "name": "Adaptation",
  "internalName": "Evolution",
  "available": 9,
  "description": "By purchasing this power you gain access to three mutually exclusive toggle powers: Efficient Adaptation, Defensive Adaptation and Offensive Adaptation. If Defensive Adaptation is active you gain improved damage resistance from Hardened Carapace and Evolving Armor, additional defense from Environmental Modification and Evolving Armor, and increased Maximum HP from Environmental Modification and Inexhaustible. If Offensive Adaptation is active you gain bonus damage from Hardened Carapace, additional To Hit from Environmental Modification, empowered -resistance debuff from Evolving Armor, and your debuff effects from DNA Siphon, Genetic Contamination and Parasitic Aura are increased. While Efficient Adaptation is active Hardened Carapace will provide a moderate endurance discount, Inexhaustible has increased Regeneration and Recovery, Evolving Armor grants additional regeneration and recovery per nearby target, DNA Siphon grants additional regeneration and recovery for each defeated target and Parasitic Aura grants additional regeneration and recovery for each nearby target.",
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
