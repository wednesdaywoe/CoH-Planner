/**
 * Envenomed Blades
 * Self +Toxic Damage on all attacks, +ToHit
 *
 * Source: dominator_assault/martial_assault/envenomed_blades.json
 */

import type { Power } from '@/types';

export const EnvenomedBlades: Power = {
  "name": "Envenomed Blades",
  "internalName": "Envenomed_Blades",
  "available": 15,
  "description": "You add a toxic venom to all of your attacks for a moderate duration. All damaging powers gain bonus Toxic damage. You also gain a moderate bonus to your chance to hit.Recharge: Long.",
  "shortHelp": "Self +Toxic Damage on all attacks, +ToHit",
  "icon": "martialassault_envenomedblades.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 160,
    "endurance": 7.8,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 0.12,
      "table": "Melee_Ones"
    }
  }
};
