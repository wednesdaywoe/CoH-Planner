/**
 * Burst
 * Ranged, DoT (Lethal) Foe -DEF
 *
 * Source: mastermind_summon/mercenaries/burst.json
 */

import type { Power } from '@/types';

export const Burst: Power = {
  "name": "Burst",
  "internalName": "Burst",
  "available": 0,
  "description": "Quickly fires a Burst of rounds at a single target at very long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense.Focus Fire:The target struck by this attack will take 3.33% increased damage from any Mercenary Henchmen regardless of their owners for 30 seconds. This does effect does not stack from the same power or from multiple Masterminds.",
  "shortHelp": "Ranged, DoT (Lethal) Foe -DEF",
  "icon": "paramilitary_assaultrifleburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 90,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.27,
    "table": "Ranged_Damage",
    "duration": 0.91,
    "tickRate": 0.3
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
