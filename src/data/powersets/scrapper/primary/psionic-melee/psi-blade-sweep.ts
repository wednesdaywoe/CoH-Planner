/**
 * Psi Blade Sweep
 * Melee (Cone), DMG(Psionic/Lethal), Foe Disorient, -Rech; Self +Insight
 *
 * Source: scrapper_melee/psionic_melee/psi_blade_sweep.json
 */

import type { Power } from '@/types';

export const PsiBladeSweep: Power = {
  "name": "Psi Blade Sweep",
  "internalName": "Psi_Blade_Sweep",
  "available": 7,
  "description": "You project a Psi Blade and swing it in a broad arc hitting all foes within a wide cone in front of you for high Psionic and Lethal damage. Foes struck by this power have their recharge reduced and have chance to become disoriented for a short time. Psi Blade Sweep has a high chance of granting you Insight. While you have Insight, Psi Blade Sweep will deal additional minor psionic damage over time and has a greater chance to disorient foes.",
  "shortHelp": "Melee (Cone), DMG(Psionic/Lethal), Foe Disorient, -Rech; Self +Insight",
  "icon": "psionicmelee_psibladesweep.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.2217,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.77,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.36,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1.08,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.1858,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Psionic",
      "scale": 1.44,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Psionic",
      "scale": 1.44,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.648,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "rechargeDebuff": {
      "scale": 0.15,
      "table": "Melee_Slow"
    },
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
