/**
 * Psi Blade
 * Melee, DMG(Psionic/Lethal), Foe -Rech, Self +Insight
 *
 * Source: tanker_melee/psionic_melee/psi_blade.json
 */

import type { Power } from '@/types';

export const PsiBlade: Power = {
  "name": "Psi Blade",
  "internalName": "Psi_Blade",
  "available": 0,
  "description": "You lash at your foe's mind with a mentally projected blade of psychic energy to deal moderate Psionic and Lethal damage. Affected foes will have their recharge rate reduced. Psi Blade has a moderate chance to grant you Insight. While you have Insight, Psi Blade will deal additional minor psionic damage over time.",
  "shortHelp": "Melee, DMG(Psionic/Lethal), Foe -Rech, Self +Insight",
  "icon": "psionicmelee_psiblade.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 5.928,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.285,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.855,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.2285,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.513,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "rechargeDebuff": {
      "scale": 0.12,
      "table": "Melee_Slow"
    }
  }
};
