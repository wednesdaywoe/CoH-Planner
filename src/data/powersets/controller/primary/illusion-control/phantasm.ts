/**
 * Phantasm
 * Summon Phantasm: Ranged, DMG(Smash/Energy/Psionic)
 *
 * Source: controller_control/illusion_control/phantasm.json
 */

import type { Power } from '@/types';

export const Phantasm: Power = {
  "name": "Phantasm",
  "internalName": "Phantasm",
  "available": 25,
  "description": "You can construct a powerful entity composed of pure light. Although made of light, the Phantasm is tangible and has powerful Energy attacks. The Phantasm can also fly and summon duplicates of itself. The duplicates are intangible, and cannot be harmed. The duplicates' attacks deal illusory damage similar to that dealt by Spectral Wounds. Only the original Phantasm can be healed and buffed. Type ''/release_pets'' in the chat window to release all your pets.",
  "shortHelp": "Summon Phantasm: Ranged, DMG(Smash/Energy/Psionic)",
  "icon": "illusions_phantasm.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 26,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Phantasm_Controller"
    }
  }
};
