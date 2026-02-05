/**
 * Soothing Aura
 * Toggle: PBAoE, Team Minor Periodic Heal
 *
 * Source: controller_buff/pain_domination/soothing_aura.json
 */

import type { Power } from '@/types';

export const SoothingAura: Power = {
  "name": "Soothing Aura",
  "internalName": "Soothing_Aura",
  "available": 19,
  "description": "While this power is active all nearby allies will be healed by Soothing Aura every couple of seconds for a small portion of their health.Notes: While on PvP maps this power will grant affected targets a regeneration effect instead of a periodic heal.).Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Team Minor Periodic Heal",
  "icon": "paindomination_soothingaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 10,
    "endurance": 0.78,
    "castTime": 1.67,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 0.375,
    "table": "Ranged_Heal"
  }
};
