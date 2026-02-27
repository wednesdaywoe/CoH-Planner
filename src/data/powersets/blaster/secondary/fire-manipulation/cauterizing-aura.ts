/**
 * Cauterizing Aura
 * Toggle: PBAoE, DoT (Fire), Self +Heal Over Time, +Recovery
 *
 * Source: blaster_support/fire_manipulation/blazing_aura.json
 */

import type { Power } from '@/types';

export const CauterizingAura: Power = {
  "name": "Cauterizing Aura",
  "internalName": "Blazing_Aura",
  "available": 19,
  "description": "While active, you are surrounded by flames that continuously burn all foes that attempt to enter melee range. In addition, you recover a small amount of health every few seconds.Damage: Minor(DoT).Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, DoT (Fire), Self +Heal Over Time, +Recovery",
  "icon": "firemanipulation_blazingaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.2,
    "table": "Melee_Damage"
  }
};
