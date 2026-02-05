/**
 * Shadowy Binds
 * Ranged, Moderate DoT(Negative), Foe Immobilize, -To Hit, -Fly
 *
 * Source: controller_control/darkness_control/shadowy_binds.json
 */

import type { Power } from '@/types';

export const ShadowyBinds: Power = {
  "name": "Shadowy Binds",
  "internalName": "Shadowy_Binds",
  "available": 0,
  "description": "You take control of your victim's shadow causing it to entangle and bind its owner thus leaving them immobilized and suffering from negative energy damage over time and reducing their chance to hit. Immobilized foes cannot move but can still attack.Damage: High.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DoT(Negative), Foe Immobilize, -To Hit, -Fly",
  "icon": "darknesscontrol_shadowybinds.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.2
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
    "Controller Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.2,
      "table": "Ranged_Damage",
      "duration": 9.2,
      "tickRate": 2
    },
    {
      "type": "Negative",
      "scale": 0.2,
      "table": "Ranged_InherentDamage",
      "duration": 9.2,
      "tickRate": 2
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 4,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
