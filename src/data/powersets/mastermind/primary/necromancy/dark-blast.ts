/**
 * Dark Blast
 * Ranged, DMG(Negative), Foe -To Hit
 *
 * Source: mastermind_summon/necromancy/dark_blast.json
 */

import type { Power } from '@/types';

export const DarkBlast: Power = {
  "name": "Dark Blast",
  "internalName": "Dark_Blast",
  "available": 0,
  "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.Spectral Forces:Activating this power has a chance to summon a Specter to your side! Specters slowly fade away over 90 seconds, even faster when attacking. They cannot be healed, regenerate, upgraded, or commanded, but provide a good distraction. Enhancements in this power will also enhance the stats of summoned Specters. You may only have 1 Specter active per Necromancy attack.",
  "shortHelp": "Ranged, DMG(Negative), Foe -To Hit",
  "icon": "necromancy_darkblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
