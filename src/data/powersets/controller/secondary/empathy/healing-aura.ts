/**
 * Healing Aura
 * PBAoE, Team +Heal
 *
 * Source: controller_buff/empathy/siphon_energy.json
 */

import type { Power } from '@/types';

export const HealingAura: Power = {
  "name": "Healing Aura",
  "internalName": "Siphon_Energy",
  "available": 0,
  "description": "Healing Aura restores some Hit Points to you and all nearby heroes. Healing Aura is not as potent as Heal Other, but can heal multiple targets at once.Recharge: Moderate.",
  "shortHelp": "PBAoE, Team +Heal",
  "icon": "empathy_healingaura.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 8,
    "endurance": 13,
    "castTime": 2.03,
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
    "scale": 1,
    "table": "Ranged_Heal"
  }
};
