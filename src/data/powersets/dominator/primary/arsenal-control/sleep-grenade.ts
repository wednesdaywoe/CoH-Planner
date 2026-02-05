/**
 * Sleep Grenade
 * Ranged (Location AoE), DMG(Toxic), Foe Sleep, -SPD, -Recharge, -Fly
 *
 * Source: dominator_control/arsenal_control/sleep_grenade.json
 */

import type { Power } from '@/types';

export const SleepGrenade: Power = {
  "name": "Sleep Grenade",
  "internalName": "Sleep_Grenade",
  "available": 1,
  "description": "The Sleep Grenade can be launched at long range from beneath the barrel of your Assault Rifle. It releases a cloud of gas that will make enemies drowsy, slow, and fall asleep.",
  "shortHelp": "Ranged (Location AoE), DMG(Toxic), Foe Sleep, -SPD, -Recharge, -Fly",
  "icon": "arsenalcontrol_sleepgrenade.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.05,
    "range": 80,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Sleep",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "displayName": "Sleep Grenade",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Redirects.Assault_Rifle.Sleep_Grenade",
        "Redirects.Assault_Rifle.Sleep_Grenade_Damage"
      ],
      "duration": 30
    }
  }
};
