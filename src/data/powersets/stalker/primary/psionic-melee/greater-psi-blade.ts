/**
 * Greater Psi Blade
 * Melee, DMG(Psionic/Lethal), Foe -Rech, Hold; Self -Insight
 *
 * Source: stalker_melee/psionic_melee/greater_psi_blade.json
 */

import type { Power } from '@/types';

export const GreaterPsiBlade: Power = {
  "name": "Greater Psi Blade",
  "internalName": "Greater_Psi_Blade",
  "available": 21,
  "description": "You focus and create a more powerful Psi Blade projection before slashing at your foe to deal superior Psionic and Lethal damage. The affected foe will have their recharge reduced moderately and be left held for a short time. Greater Psi Blade will cause additional damage and cause this power's hold to last for a longer duration if you have Insight. Using this power removes Insight.",
  "shortHelp": "Melee, DMG(Psionic/Lethal), Foe -Rech, Hold; Self -Insight",
  "icon": "psionicmelee_greaterpsiblade.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.5
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.69,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 2.0025,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
