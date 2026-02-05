/**
 * Sting of the Wasp
 * Melee, DMG(Lethal), Foe -Def
 *
 * Source: stalker_melee/ninja_sword/hack.json
 */

import type { Power } from '@/types';

export const StingoftheWasp: Power = {
  "name": "Sting of the Wasp",
  "internalName": "Hack",
  "available": 0,
  "description": "You perform a standard attack with your Ninja Blade. This attack is slower than Gambler's Cut, but deals more lethal damage. Sting of the Wasp can reduce a target's Defense, making them easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Foe -Def",
  "icon": "katana_hack.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.16,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
