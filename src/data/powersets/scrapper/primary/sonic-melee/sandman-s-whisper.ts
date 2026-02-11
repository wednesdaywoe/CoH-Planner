/**
 * Sandman's Whisper
 * Melee, DMG(Smashing/Energy), Foe Sleep, -Res(DMG)
 *
 * Source: scrapper_melee/sonic_melee/sandmans_whisper.json
 */

import type { Power } from '@/types';

export const SandmansWhisper: Power = {
  "name": "Sandman's Whisper",
  "internalName": "Sandmans_Whisper",
  "available": 17,
  "description": "You whisper in your foe's ear with a slumbering effect. Affected foe might fall asleep and will have their damage resistance lowered. This power will inflict 10% bonus damage against Attuned targets.",
  "shortHelp": "Melee, DMG(Smashing/Energy), Foe Sleep, -Res(DMG)",
  "icon": "sonicmanipulation_whisper2.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.77
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.64,
    "table": "Melee_Damage"
  }
};
