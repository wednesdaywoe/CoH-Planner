/**
 * Typhoon's Edge
 * PBAoE Melee, DMG(Lethal)
 *
 * Source: brute_melee/dual_blades/aoe_bridge.json
 */

import type { Power } from '@/types';

export const TyphoonsEdge: Power = {
  "name": "Typhoon's Edge",
  "internalName": "AoE_Bridge",
  "available": 5,
  "description": "You spin around in a circle, attacking everyone within melee range with a striking attack. This attack is the finishing move in both the Weaken and Sweep combination attacks.Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.",
  "shortHelp": "PBAoE Melee, DMG(Lethal)",
  "icon": "dualblades_aoebridge.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 2.27,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.57,
      "table": "Melee_Damage",
      "duration": 0.6,
      "tickRate": 0.4
    },
    {
      "type": "Lethal",
      "scale": 0.57,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.2565,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.2565,
      "table": "Melee_Damage",
      "duration": 0.6,
      "tickRate": 0.4
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "tohitDebuff": {
      "scale": 1,
      "table": "Melee_DeBuff_ToHit"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
