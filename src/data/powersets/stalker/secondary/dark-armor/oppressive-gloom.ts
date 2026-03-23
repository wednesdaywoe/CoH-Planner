/**
 * Oppressive Gloom
 * Toggle: PBAoE, Foe Disorient, Self -HP
 *
 * Source: stalker_defense/dark_armor/oppressive_gloom.json
 */

import type { Power } from '@/types';

export const OppressiveGloom: Power = {
  "name": "Oppressive Gloom",
  "internalName": "Oppressive_Gloom",
  "available": 27,
  "description": "The Netherworld has many mutable properties, such as the Oppressive Gloom. This power allows you to use your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Foe Disorient, Self -HP",
  "icon": "darkarmor_oppressivegloom.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 8,
    "endurance": 0.156,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Special",
    "scale": 0.1,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    }
  }
};
