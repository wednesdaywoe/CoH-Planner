/**
 * Radiation Infection
 * Toggle: Ranged (Targeted AoE), Foe -DEF, -To Hit
 *
 * Source: controller_buff/radiation_emission/radiation_infection.json
 */

import type { Power } from '@/types';

export const RadiationInfection: Power = {
  "name": "Radiation Infection",
  "internalName": "Radiation_Infection",
  "available": 0,
  "description": "Infects a targeted foe with deadly radiation, severely reducing their chance to hit and Defense. All foes that come near the target will also become infected. The Radiation Infection will last until you deactivate it, or until the original target is defeated.Recharge: Moderate.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DEF, -To Hit",
  "icon": "radiationpoisoning_enervatingfield.png",
  "powerType": "Toggle",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 15,
    "recharge": 8,
    "endurance": 0.26,
    "castTime": 1.5,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Defense Debuff"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "defenseDebuff": {
      "scale": 2.5,
      "table": "Ranged_Debuff_Def"
    }
  }
};
