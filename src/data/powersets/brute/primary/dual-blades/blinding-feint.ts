/**
 * Blinding Feint
 * Melee, DMG(Lethal), Self +DMG, +To Hit
 *
 * Source: brute_melee/dual_blades/follow_up.json
 */

import type { Power } from '@/types';

export const BlindingFeint: Power = {
  "name": "Blinding Feint",
  "internalName": "Follow_Up",
  "available": 7,
  "description": "You perform a feint attack that deals light damage. After this attack hits, it gives you a large bonus to your chance to hit and damage for a brief time. This power is the finishing move in the Empower combination attack.Empower: Nimble Slash > Ablating Strike > Blinding Feint.",
  "shortHelp": "Melee, DMG(Lethal), Self +DMG, +To Hit",
  "icon": "dualblades_followup.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 7.8,
    "castTime": 1.2
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "ToHit",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee Damage",
    "Threat Duration",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.36,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitBuff": {
      "scale": 0.33,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 1,
      "table": "Melee_Buff_Dmg"
    }
  }
};
