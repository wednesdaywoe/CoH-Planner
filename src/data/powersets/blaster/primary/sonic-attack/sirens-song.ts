/**
 * Sirens Song
 * Ranged (Cone), DMG(Energy), Foe Sleep
 *
 * Source: blaster_ranged/sonic_attack/sirens_song.json
 */

import type { Power } from '@/types';

export const SirensSong: Power = {
  "name": "Sirens Song",
  "internalName": "Sirens_Song",
  "available": 17,
  "description": "You send forth a subsonic pulse which causes your foes to fall unconscious and take energy damage. Your foes will remain unconscious for a good while, but will awaken if disturbed.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required against AVs and players, as well as to make secondary effects apply.",
  "shortHelp": "Ranged (Cone), DMG(Energy), Foe Sleep",
  "icon": "sonicblast_sleep.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.8727,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.86,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1.1902,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.1902,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "sleep": {
      "mag": 3,
      "scale": 30,
      "table": "Ranged_Sleep"
    }
  }
};
