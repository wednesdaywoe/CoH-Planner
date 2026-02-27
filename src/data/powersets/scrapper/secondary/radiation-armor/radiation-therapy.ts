/**
 * Radiation Therapy
 * PBAoE, DMG(Energy), DoT(Toxic), Foe -Regen, Self +HP, +End, Res(-Regen)
 *
 * Source: scrapper_defense/radiation_armor/radiation_therapy.json
 */

import type { Power } from '@/types';

export const RadiationTherapy: Power = {
  "name": "Radiation Therapy",
  "internalName": "Radiation_Therapy",
  "available": 15,
  "description": "You channel a tremendous amount of radiation into a barrier around you. For a short time you will have a strong absorption shield in addition to a regeneration and recovery buff.Notes: This power has adaptive recharge. It has a base recharge of 15  seconds and each affected foe will increase the recharge by a varying amount. First target adds 12 seconds for a maximum total of 60 seconds.",
  "shortHelp": "PBAoE, DMG(Energy), DoT(Toxic), Foe -Regen, Self +HP, +End, Res(-Regen)",
  "icon": "radiationarmor_radiationtherapy.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "radius": 20,
    "recharge": 60,
    "endurance": 13,
    "castTime": 1.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
