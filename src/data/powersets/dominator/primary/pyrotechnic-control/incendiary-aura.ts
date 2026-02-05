/**
 * Incendiary Aura
 * Toggle: PBAoE, Chance for Blast Off. -ToHit, -Defense
 *
 * Source: dominator_control/pyrotechnic_control/incendiary_aura.json
 */

import type { Power } from '@/types';

export const IncendiaryAura: Power = {
  "name": "Incendiary Aura",
  "internalName": "Incendiary_Aura",
  "available": 17,
  "description": "You create an aura of pyrotechnic energy around yourself that has combustible properties. Enemies within range of the power have a persistent chance of Blasting Off into the air, as well as suffer from reduced ToHit and Defense.",
  "shortHelp": "Toggle: PBAoE, Chance for Blast Off. -ToHit, -Defense",
  "icon": "pyrotechnic_incendiaryaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 20,
    "endurance": 0.08,
    "castTime": 1.47,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
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
      "scale": 1.25,
      "table": "Melee_DeBuff_ToHit"
    },
    "slow": {
      "jumpHeight": {
        "scale": 500,
        "table": "Melee_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_Def"
    }
  }
};
