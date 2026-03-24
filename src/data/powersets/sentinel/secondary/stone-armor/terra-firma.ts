/**
 * Terra Firma
 * Auto: Self +To Hit, +ACC, +Range, Res(ToHit)
 *
 * Source: sentinel_defense/stone_armor/terra_firma.json
 */

import type { Power } from '@/types';

export const TerraFirma: Power = {
  "name": "Terra Firma",
  "internalName": "Terra_Firma",
  "available": 9,
  "description": "Being on solid ground allows you to more carefully aim your attack for optimal range. This power increases your chance to hit, accuracy, and range of your attacks and makes you more resistant to To-Hit debuffs, but only applies when you are near the ground.",
  "shortHelp": "Auto: Self +To Hit, +ACC, +Range, Res(ToHit)",
  "icon": "stonearmor_terrafirma.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "activatePeriod": 0.5
  },
  "allowedEnhancements": [
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 0.25,
      "table": "Melee_Buff_ToHit"
    },
    "durations": {
      "tohitBuff": 0.75,
      "debuffResistance": 0.75,
      "rangeBuff": 0.75
    },
    "debuffResistance": {
      "tohit": {
        "scale": 1,
        "table": "Melee_Res_Boolean"
      }
    },
    "rangeBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "buffDuration": 0.75
  }
};
