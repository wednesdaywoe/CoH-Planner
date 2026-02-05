/**
 * Grounded
 * Auto: Self +Res (All DMG but Toxic and Psionics, End Drain, Immobilize, KB)
 *
 * Source: scrapper_defense/electric_armor/grounded.json
 */

import type { Power } from '@/types';

export const Grounded: Power = {
  "name": "Grounded",
  "internalName": "Grounded",
  "available": 15,
  "description": "You are Grounded and naturally very resistant to Energy and Negative Energy damage. You also have added resistance to Endurance Drain effects. Additionally, Grounded provides Immobilize, Knockback protection and the Grounded status, but only for up to 10 seconds after being near the ground. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (All DMG but Toxic and Psionics, End Drain, Immobilize, KB)",
  "icon": "electricarmor_selfresistenergies.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6
};
