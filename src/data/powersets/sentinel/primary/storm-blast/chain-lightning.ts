/**
 * Chain Lightning
 * Ranged Chain, DMG(Energy), Foe -End
 *
 * Source: sentinel_ranged/storm_blast/chain_lightning.json
 */

import type { Power } from '@/types';

export const ChainLightning: Power = {
  "name": "Chain Lightning",
  "internalName": "Chain_Lightning",
  "available": 17,
  "description": "Calls a bolt of lightning from the clouds to strike your target, which then chains outward to additional enemies. The chain effect auto-hits for application across targets, though the power still requires a successful hit check. Creatures struck will be dealt Energy damage and be sapped of some endurance.",
  "shortHelp": "Ranged Chain, DMG(Energy), Foe -End",
  "icon": "stormblast_chainlightning.png",
  "powerType": "Click",
  "effectArea": "Chain",
  "stats": {
    "accuracy": 1.15,
    "range": 40,
    "radius": 12,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Ranged_EndDrain"
    }
  }
};
