/**
 * Consume
 * PBAoE, DMG(Fire), Self +End, +Max HP
 *
 * Source: tanker_defense/fiery_aura/consume.json
 */

import type { Power } from '@/types';

export const Consume: Power = {
  "name": "Consume",
  "internalName": "Consume",
  "available": 7,
  "description": "You can drain body heat from all nearby foes, and even from the air itself, increasing your health, resistance against endurance drain, as well as replenishing your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage.HP and End Drain resistance do not scale with enemy count, but will be granted even if there are no enemies nearby.Damage: Minor.Recharge: Long.",
  "shortHelp": "PBAoE, DMG(Fire), Self +End, +Max HP",
  "icon": "flamingshield_consume.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 180,
    "endurance": 0.52,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 20,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.05,
      "table": "Melee_Ones"
    }
  }
};
