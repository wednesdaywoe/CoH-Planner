/**
 * Lightning Field
 * Toggle: PBAoE, Minor DoT(Energy), Foe -End
 *
 * Source: brute_defense/electric_armor/lightning_field.json
 */

import type { Power } from '@/types';

export const LightningField: Power = {
  "name": "Lightning Field",
  "internalName": "Lightning_Field",
  "available": 0,
  "description": "While active, you emit a storm of electricity that constantly damages all nearby foes.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Energy), Foe -End",
  "icon": "electricarmor_pbaoeminordamage.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 1.04,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Endurance Modification",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.2,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.03,
      "table": "Melee_Ones"
    }
  }
};
