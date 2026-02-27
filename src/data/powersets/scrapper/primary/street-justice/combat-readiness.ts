/**
 * Combat Readiness
 * Self, +Dmg, +To Hit, Special
 *
 * Source: scrapper_melee/brawling/combat_readiness.json
 */

import type { Power } from '@/types';

export const CombatReadiness: Power = {
  "name": "Combat Readiness",
  "internalName": "Combat_Readiness",
  "available": 5,
  "description": "Activating this power will increase your chance to hit and the amount of damage you deal for a short amount of time as well as setting your current Combo Level to 3.",
  "shortHelp": "Self, +Dmg, +To Hit, Special",
  "icon": "brawling_combatreadiness.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    }
  }
};
