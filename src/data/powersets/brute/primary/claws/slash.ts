/**
 * Slash
 * Melee, DMG(Lethal), Foe -DEF
 *
 * Source: brute_melee/claws/slash.json
 */

import type { Power } from '@/types';

export const Slash: Power = {
  "name": "Slash",
  "internalName": "Slash",
  "available": 1,
  "description": "You Slash at your foe with your claws, dealing a good amount of lethal damage, but with a longer recharge rate than Swipe or Strike . This attack can reduce a target's Defense, making him easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Foe -DEF",
  "icon": "claws_slash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6.4,
    "endurance": 6.8224,
    "castTime": 1.33
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
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.74,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.74,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.333,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.333,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
