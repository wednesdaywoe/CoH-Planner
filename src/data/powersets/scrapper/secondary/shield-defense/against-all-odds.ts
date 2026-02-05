/**
 * Against All Odds
 * Toggle: Self +DMG, Foe -DMG
 *
 * Source: scrapper_defense/shield_defense/against_all_odds.json
 */

import type { Power } from '@/types';

export const AgainstAllOdds: Power = {
  "name": "Against All Odds",
  "internalName": "Against_all_Odds",
  "available": 15,
  "description": "The harder pressed you are in combat the greater your offensive abilities become. Each enemy that stands toe-to-toe with you in combat will grant you a damage bonus. The first foe you engage in melee grants the highest damage bonus, and up to 10 foes can contribute to this effect. Each foe in melee range also suffers from reduced damage as your shield deflects a portion of their damage.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +DMG, Foe -DMG",
  "icon": "shielddefense_againstallodds.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 2.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 0.55,
      "table": "Melee_Buff_Dmg"
    },
    "damageDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Dam"
    }
  }
};
