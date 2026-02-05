/**
 * Umbral Torrent
 * Ranged (Cone), DMG(Negative), Foe -To Hit, Knockback
 *
 * Source: blaster_ranged/dark_blast/umbral_torrent.json
 */

import type { Power } from '@/types';

export const UmbralTorrent: Power = {
  "name": "Umbral Torrent",
  "internalName": "Umbral_Torrent",
  "available": 1,
  "description": "You summon a wave of mire that sweeps away foes within its arc. This attack deals moderate Negative Energy damage to foes, reduces their chance to hit and sends them flying.",
  "shortHelp": "Ranged (Cone), DMG(Negative), Foe -To Hit, Knockback",
  "icon": "darkcast_torrent.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 80,
    "arc": 0.5236,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 1.03,
    "maxTargets": 10
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
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.96,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 5,
      "table": "Ranged_Knockback"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
