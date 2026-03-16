/**
 * Psionic Lance
 * Sniper, Extreme DMG(Psionic), Target -Recharge
 *
 * Source: dominator_assault/psionic_assault/psionic_lance.json
 */

import type { Power } from '@/types';

export const PsionicLance: Power = {
  "name": "Psionic Lance",
  "internalName": "Psionic_Lance",
  "available": 27,
  "description": "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Psionic), Target -Recharge",
  "icon": "psionicassault_psioniclance.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 175,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 3
  },
  "allowedEnhancements": [
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 4.5,
    "table": "Ranged_Damage"
  },
  "quickSnipe": {
    "stats": {
      "castTime": 1.33,
      "range": 100
    },
    "damage": {
      "type": "Psionic",
      "scale": 3.56,
      "table": "Ranged_Damage"
    }
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.15,
      "table": "Ranged_Slow"
    },
    "durations": {
      "rechargeDebuff": 10
    },
    "buffDuration": 10
  }
};
